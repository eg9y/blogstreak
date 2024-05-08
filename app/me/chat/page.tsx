/* eslint-disable no-unused-vars */
"use client";

import { useCallback, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SSE } from "sse.js";
import { LoaderIcon } from "lucide-react";
import type { OpenAI } from "openai";

import { Button } from "@/app/components/button";

const edgeFunctionUrl =
  "https://rtqqghdaovkqqpwcsrpy.supabase.co/functions/v1/openai";

export default function Chat() {
  const [prompt, setPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [hasClippyError, setHasClippyError] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const eventSourceRef = useRef<SSE>();

  const handleChatResponse = useCallback((query: string) => {
    setAnswer(undefined);
    setIsResponding(false);
    setHasClippyError(false);
    setHasSearchError(false);
    setIsLoading(true);

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

        setAnswer((currentAnswer: string | undefined) => {
          return (currentAnswer ?? "") + (delta.content ?? "");
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
    ? "Blogstreak is searching..."
    : isResponding
      ? "Blogstreak is responding..."
      : undefined;

  return (
    <div className="flex flex-col items-center">
      <div className="chatui">
        <div className="flex flex-col">
          {answer && (
            <div className="prose dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {answer}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleChatResponse(prompt || "");
            }}
            className=""
          >
            <input
              id="chatui-input"
              type="text"
              className="chatui-input"
              placeholder="Enter your message..."
              value={prompt}
              onChange={(event) => {
                setPrompt(event.target.value);
              }}
            />
            <Button onClick={() => {}}>Send</Button>
          </form>
        }
      </div>

      <div className="chatui-extra-control">
        <Button onClick={() => {}}>Reset Chat</Button>
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
  );
}
