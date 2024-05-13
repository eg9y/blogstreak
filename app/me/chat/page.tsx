/* eslint-disable no-unused-vars */
"use client";

import { FormEvent, useCallback, useRef, useState, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SSE } from "sse.js";
import { LoaderIcon } from "lucide-react";
import type { OpenAI } from "openai";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Sticky from "react-sticky-el";

import { Button } from "@/app/components/button";

const edgeFunctionUrl =
  "https://rtqqghdaovkqqpwcsrpy.supabase.co/functions/v1/openai";

export default function Chat() {
  const [messages, setMessages] = useState<
    {
      role: "user" | "assistant";
      message: string;
    }[]
  >([]);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [hasClippyError, setHasClippyError] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const eventSourceRef = useRef<SSE>();

  const inputParentRef = useRef<HTMLDivElement>(null);

  const handleChatResponse = useCallback((query: string) => {
    setIsResponding(false);
    setHasClippyError(false);
    setHasSearchError(false);
    setIsLoading(true);

    setMessages((currMessages) => {
      return [
        ...currMessages,
        {
          role: "user",
          message: prompt,
        },
        {
          role: "assistant",
          message: "",
        },
      ];
    });

    const eventSource = new SSE(`${edgeFunctionUrl}/openai`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      payload: JSON.stringify({ messages: [{ role: "user", content: query }] }),
    });

    function handleError<T>(err: T) {
      setIsLoading(false);
      setIsResponding(false);
      setHasClippyError(true);
      console.error(err);
    }

    eventSource.addEventListener("error", handleError);
    eventSource.addEventListener("message", (event: any) => {
      try {
        setIsLoading(false);

        if (event.data === "[DONE]") {
          setIsResponding(false);
          return;
        }

        setIsResponding(true);

        const completionResponse: OpenAI.ChatCompletionChunk = JSON.parse(
          event.data,
        );

        const [{ delta }] = completionResponse.choices;

        console.log("completionResponse", completionResponse);

        setMessages((currMessages) => {
          const newMessages = [...currMessages];
          const lastMessage = newMessages[newMessages.length - 1].message;
          newMessages[newMessages.length - 1].message =
            (lastMessage ?? "") + (delta.content ?? "");
          return newMessages;
        });
      } catch (err) {
        handleError(err);
      }
    });

    eventSource.stream();

    eventSourceRef.current = eventSource;

    setIsLoading(true);
  }, []);

  const status = isLoading
    ? "TypeMemo is searching..."
    : isResponding
      ? "TypeMemo is responding..."
      : undefined;

  return (
    <>
      <div className="flex flex-col items-center p-4">
        <div className="chatui flex w-full max-w-[800px] flex-col gap-4">
          <div className="flex min-h-[200px] flex-col gap-4 rounded-md p-2 ring-1 ring-slate-100">
            {messages.map((message) => {
              return (
                <div
                  className="flex flex-col leading-tight"
                  key={message.message}
                >
                  <p className="font-bold">
                    {message.role === "assistant" ? "TypeMemo" : "You"}
                  </p>
                  <div className="prose dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.message}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-6 py-1">
            {status ? (
              <span className="bg-scale-400 hidden items-center gap-2 rounded-lg px-2 py-1 md:flex">
                {(isLoading || isResponding) && (
                  <LoaderIcon size={14} className="animate-spin" />
                )}
                {status}
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <Sticky mode="bottom" stickyClassName="z-[100] max-w-[800px]">
        <div className="flex min-h-10">
          <div className="flex w-full items-end gap-1">
            <div
              className="
                    grid
                    grow
                    text-sm
                    after:invisible
                    after:whitespace-pre-wrap
                    after:border
                    after:px-3.5
                    after:py-2.5
                    after:text-inherit
                    after:content-[attr(data-cloned-val)_'_']
                    after:[grid-area:1/1/2/2]
                    [&>textarea]:resize-none
                    [&>textarea]:overflow-hidden
                    [&>textarea]:text-inherit
                    [&>textarea]:[grid-area:1/1/2/2]
                "
              ref={inputParentRef}
            >
              <textarea
                className="w-full appearance-none rounded border border-transparent bg-slate-100 px-3.5 py-2.5 text-slate-600 outline-none hover:border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                name="message"
                id="message"
                rows={2}
                value={prompt}
                onInput={(textAreaEvent: FormEvent<HTMLTextAreaElement>) => {
                  if (!inputParentRef.current) {
                    return;
                  }
                  inputParentRef.current.dataset.clonedVal =
                    textAreaEvent.currentTarget.value;
                  setPrompt(textAreaEvent.currentTarget.value);
                }}
                onKeyDown={(keyEvent: KeyboardEvent<HTMLTextAreaElement>) => {
                  if (keyEvent.key !== "Enter" || keyEvent.shiftKey) {
                    return;
                  }
                  keyEvent.preventDefault();
                  handleChatResponse(prompt);
                }}
                placeholder="How can I help you?..."
                required
              />
            </div>
            <Button className="h-16" onClick={() => {}}>
              <ArrowUpIcon />
            </Button>
          </div>
        </div>
        <div className="chatui-extra-control">
          <Button onClick={() => {}}>Reset Chat</Button>
        </div>
      </Sticky>
    </>
  );
}
