import { Injectable } from "@angular/core";
import moment from 'jalali-moment';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class Call {
  public event = new Subject<any>();

  // RTCPeerConnection
  private pc: RTCPeerConnection | null = null;
  // RTCDataChannel
  private dc: RTCDataChannel | null = null;
  // HTMLAudioElement to play remote audio
  private audioElement: HTMLAudioElement | null = null;

  public async create() {
    try {
      // Create RTCPeerConnection
      this.pc = new RTCPeerConnection();

      // Set up to play remote audio from the model
      this.audioElement = document.createElement("audio");
      this.audioElement.autoplay = true;
      this.pc.ontrack = (e) => (this.audioElement!.srcObject = e.streams[0]);

      // Add local audio track for microphone input in the browser
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.pc.addTrack(ms.getTracks()[0]);

      // Set up data channel for sending and receiving events
      this.dc = this.pc.createDataChannel("oai-events");

      this.listen();

      const offer = await this.pc.createOffer();

      // Set local description first
      await this.pc.setLocalDescription(offer);

      // Get a session token for OpenAI Realtime API
      const response = await fetch("/api/v1/session", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }

      await this.pc.setRemoteDescription({
        type: 'answer',
        sdp: await response.text(),
      });
    } catch (error) {
      this.destroy();
      console.error("Error creating call:", error);
      throw error;
    }
  }

  public destroy() {
    if (this.dc) {
      this.dc.close();
    }

    if (this.pc) {
      this.pc!.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });

      this.pc!.close();
      this.pc = null;
    }

    // destory audio element
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.srcObject = null;
      this.audioElement = null;
    }
  }

  private send(data: any) {
    if (this.dc && this.dc.readyState === "open") {
      this.dc.send(JSON.stringify(data));
    }
  }

  private listen() {
    if (!this.dc) {
      return;
    }

    this.dc.onopen = () => {
      console.log("Data channel opened");
    }

    this.dc.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      // if event is "session.created", send hello
      if (data.type === "session.created") {
        this.hello();
      }

      if (data.type == 'response.done') {
        const response = data['response']['output'][0];

        if (response && response.type == 'message') {
          const content = response.content[0]['transcript'];

          this.event.next({ type: 'message', data: content });
        }

        if (response && response.type == 'function_call') {
          const tool = this.tools.find((item) => item.name === response.name);

          if (tool) {
            // args are stringified JSON
            const args = JSON.parse(response.arguments || '{}');
            const result = await tool.function(args);

            // send back function_call.result
            this.send({
              type: 'conversation.item.create',
              item: {
                type: 'function_call_output',
                call_id: response.call_id,
                output: result,
              }
            });
          }
        }
      }
    }
  }

  /**
   * hello function send some events to update sessions (language, tools, instructions)
   */
  private hello() {
    if (!this.dc || this.dc.readyState !== "open") {
      return;
    }

    // tools for gpt-realtime
    this.send({
      type: 'session.update',
      session: {
        type: "realtime",
        instructions: this.instructions,
        tools: this.tools.map((item) => ({
          type: "function",
          ...item,
          function: undefined,
        })),
        tool_choice: "auto",
      }
    });
  }

  private get instructions(): string {
    // In Persian/Farsi instructions
    let prompt = `
    تو یک دستیار هوش مصنوعی هستی که به زبان فارسی صحبت می‌کنی و به درخواست‌های کاربر پاسخ می‌دهی. تو می‌توانی از ابزارهای خاصی برای کمک به کاربر استفاده کنی. وقتی کاربر سوالی پرسید یا درخواستی داشت، بهترین ابزار را انتخاب کن و از آن استفاده کن. اگر نیازی به استفاده از ابزارها نیست، بگو من یک مدل زبانی هستم و نمی تونم پاسخ شما را بدهم.
    این ابزار ها رو بشناس:
    `;

    for (const tool of this.tools) {
      prompt += `نام ابزار: ${tool.name}\nتوضیح: ${tool.description}\n\n`;
    }

    prompt += `اگر آماده هستی شروع کن و توضیحات کوتاهی در مورد ابزار ها بده. حتما پاسخ های خیلی کوتاه بده.`;

    prompt += 'اسم تو دستیار هوش مصنوعی میرزا است. حتما خودت رو معرفی کن.';

    return prompt;
  }

  private get tools() {
    return [
      {
        name: "show-menu",
        description: "Show the list of available products and menu to the user. If user asks for it.",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
        function: async () => {
          const result = await fetch('https://menu.fika-coffee.ir/api/menu');
          const json = await result.json();

          const products = json.data.flatMap((items: any) =>
            items.products.map((item: any) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              currency: 'تومان',
              image: item.image,
              category: items.name,
            }))
          );

          this.event.next({ type: 'show-menu', data: products });

          return JSON.stringify(products.map((item: any) => ({
            ...item,
            image: undefined,
          })));
        }
      },
      {
        name: "place-order",
        description: "Place an order for the user based on their selected products.",
        parameters: {
          type: "object",
          properties: {
            fullname: {
              type: "string",
              description: "Customer's full name"
            },
            phone: {
              type: "string",
              description: "Customer's phone number"
            },
            product_ids: {
              type: "array",
              items: {
                type: "number"
              },
              description: "Array of product IDs to order"
            }
          },
          required: ["fullname", "phone", "product_ids"],
        },
        function: async (args: { fullname: string; phone: string; product_ids: number[] }) => {
          const orderData = {
            customer_name: args.fullname,
            phone_number: args.phone,
            products: args.product_ids,
            timestamp: new Date().toISOString()
          };

          this.event.next({ type: 'place-order', data: orderData });

          return `سفارش برای ${args.fullname} با شماره ${args.phone} ثبت شد.`;
        }
      },
      {
        name: "time",
        description: `Get the current date and time in Persian/Farsi format`,
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
        function: () => {
          const result = moment().locale('fa').format('LLLL');
          this.event.next({ type: 'time', data: result });
          return result;
        },
      },
      {
        name: "destroy",
        description: "End the call session when user requests disconnection or said goodbye.",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
        function: () => {
          this.destroy();
          this.event.next({ type: 'destroy' });
        }
      },
    ];
  }
}
