"use client";

// NOTE: This is for the local in-browser implementation later on. IGNORE FOR NOW.

import { useState } from "react";
import { ChatCompletionMessageParam, Engine } from "@mlc-ai/web-llm";

import ChatUI from "@/utils/chatUi";
import { Button } from "@/app/components/button";

export default function Chat() {
  const [messages, setMessages] = useState<{ kind: string; text: string }[]>(
    [],
  );
  const [prompt, setPrompt] = useState("");
  const [runtimeStats, setRuntimeStats] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatCompletionMessageParam[]>(
    [],
  );
  const [chat_ui] = useState(new ChatUI(new Engine(), setChatHistory));

  const updateMessage = (kind: string, text: string, append: boolean) => {
    if (kind === "init") {
      // eslint-disable-next-line no-param-reassign
      text = `[System Initalize] ${text}`;
    }
    const msgCopy = [...messages];
    if (msgCopy.length === 0 || append) {
      setMessages([...msgCopy, { kind, text }]);
    } else {
      msgCopy[msgCopy.length - 1] = { kind, text };
      setMessages([...msgCopy]);
    }
  };
  return (
    <div className="flex flex-col items-center">
      {/* <Button
        className="chatui-btn"
        onClick={() => {
          chat_ui.asyncInitChat(updateMessage).catch((error) => {
            console.log(error);
          });
        }}
      >
        Download Model
      </Button> */}

      <div className="chatui">
        <div className="flex flex-col" id="chatui-chat">
          {chatHistory.map((value, index) => (
            <div key={index}>
              <div className="msg-bubble">
                <div className="msg-text">
                  ${value.role}: {JSON.stringify(value.content, null, 2)}
                </div>
              </div>
            </div>
          ))}

          {chat_ui.requestInProgress &&
            messages.map((value, index) => (
              <div key={index} className={`msg ${value.kind}-msg`}>
                <div className="msg-bubble">
                  <div className="msg-text">${value.text}</div>
                </div>
              </div>
            ))}
        </div>

        {chat_ui && (
          <div className="chatui-inputarea">
            <input
              id="chatui-input"
              type="text"
              className="chatui-input"
              placeholder="Enter your message..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  try {
                    chat_ui.onGenerate(prompt, updateMessage, setRuntimeStats);
                  } catch (error) {
                    console.log("error", error);
                  }
                }
              }}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
            <Button
              onClick={() => {
                try {
                  chat_ui.onGenerate(prompt, updateMessage, setRuntimeStats);
                } catch (error) {
                  console.log("error", error);
                }
              }}
            >
              Send
            </Button>
          </div>
        )}
      </div>

      <div className="chatui-extra-control">
        <Button
          onClick={() => {
            chat_ui
              .onReset(() => {
                setMessages([]);
              })
              .catch((error) => console.log(error));
          }}
        >
          Reset Chat
        </Button>
        <label id="chatui-info-label">{runtimeStats}</label>
      </div>
    </div>
  );
}
