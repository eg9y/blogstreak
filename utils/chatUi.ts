/* eslint-disable no-unused-vars */
import { EngineInterface, ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { Dispatch, SetStateAction } from "react";

export default class ChatUI {
  private engine: EngineInterface;
  private chatLoaded = false;
  public requestInProgress = false;
  // We use a request chain to ensure that
  // all requests send to chat are sequentialized
  private chatRequestChain: Promise<void> = Promise.resolve();
  private chatHistory: ChatCompletionMessageParam[] = [];
  private setChatHistory?: Dispatch<
    SetStateAction<ChatCompletionMessageParam[]>
  >;

  constructor(
    engine: EngineInterface,
    setChatHistory: Dispatch<SetStateAction<ChatCompletionMessageParam[]>>,
  ) {
    this.engine = engine;
    this.setChatHistory = setChatHistory;
  }

  /**
   * Push a task to the execution queue.
   *
   * @param task The task to be executed;
   */
  private pushTask(task: () => Promise<void>) {
    const lastEvent = this.chatRequestChain;
    this.chatRequestChain = lastEvent.then(task);
  }

  // Event handlers
  // all event handler pushes the tasks to a queue
  // that get executed sequentially
  // the tasks previous tasks, which causes them to early stop
  // can be interrupted by chat.interruptGenerate
  onGenerate(
    prompt: string,
    messageUpdate: (kind: string, text: string, append: boolean) => void,
    setRuntimeStats: (runtimeStats: string) => void,
  ) {
    if (this.requestInProgress) {
      return;
    }
    this.pushTask(async () => {
      await this.asyncGenerate(prompt, messageUpdate, setRuntimeStats);
    });
    // eslint-disable-next-line consistent-return
    return this.chatRequestChain;
  }

  onReset(clearMessages: () => void) {
    if (this.requestInProgress) {
      // interrupt previous generation if any
      this.engine.interruptGenerate();
    }
    this.chatHistory = [];
    if (this.setChatHistory) {
      this.setChatHistory([]);
    }

    // try reset after previous requests finishes
    this.pushTask(async () => {
      await this.engine.resetChat();
      clearMessages();
    });
    return this.chatRequestChain;
  }

  async asyncInitChat(
    messageUpdate: (kind: string, text: string, append: boolean) => void,
  ) {
    if (this.chatLoaded) return;
    this.requestInProgress = true;
    messageUpdate("init", "", true);
    const initProgressCallback = (report: { text: string }) => {
      messageUpdate("init", report.text, false);
    };
    this.engine.setInitProgressCallback(initProgressCallback);

    try {
      const selectedModel = "Llama-3-8B-Instruct-q4f32_1";
      // const selectedModel = "TinyLlama-1.1B-Chat-v0.4-q4f16_1-1k";
      await this.engine.reload(selectedModel);
    } catch (err: unknown) {
      messageUpdate("error", `Init error, ${err?.toString() ?? ""}`, true);
      console.log(err);
      await this.unloadChat();
      this.requestInProgress = false;
      return;
    }
    this.requestInProgress = false;
    this.chatLoaded = true;
  }

  private async unloadChat() {
    await this.engine.unload();
    this.chatLoaded = false;
  }

  /**
   * Run generate
   */
  private async asyncGenerate(
    prompt: string,
    messageUpdate: (kind: string, text: string, append: boolean) => void,
    setRuntimeStats: (runtimeStats: string) => void,
  ) {
    await this.asyncInitChat(messageUpdate);

    messageUpdate("right", prompt, true);
    // this.uiChatInput.value = "";
    // this.uiChatInput.setAttribute("placeholder", "Generating...");

    messageUpdate("left", "", true);

    // const prompt = this.uiChatInput.value;
    if (prompt === "") {
      this.requestInProgress = false;
      return;
    }

    this.requestInProgress = true;

    try {
      this.chatHistory.push({ role: "user", content: prompt });
      if (this.setChatHistory) {
        this.setChatHistory(this.chatHistory);
      }
      let curMessage = "";
      const completion = await this.engine.chat.completions.create({
        stream: true,
        messages: this.chatHistory,
      });
      for await (const chunk of completion) {
        const curDelta = chunk.choices[0].delta.content;
        if (curDelta) {
          curMessage += curDelta;
        }
        messageUpdate("left", curMessage, false);
      }
      const output = await this.engine.getMessage();
      this.chatHistory.push({ role: "assistant", content: output });
      if (this.setChatHistory) {
        this.setChatHistory(this.chatHistory);
      }
      messageUpdate("left", output, false);
      this.engine
        .runtimeStatsText()
        .then((stats) => setRuntimeStats(stats))
        .catch((error) => console.log(error));
    } catch (err: unknown) {
      messageUpdate("error", `Generate error, ${err?.toString() ?? ""}`, true);
      console.log(err);
      await this.unloadChat();
    }
    this.requestInProgress = false;
  }
}
