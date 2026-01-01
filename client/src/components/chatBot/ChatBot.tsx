import { FC, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";
import ReactMarkdown from "react-markdown";

type FormData = {
  prompt: string;
};

type Message = {
  content: string;
  role: "user" | "bot";
};

export const ChatBot: FC = () => {
  const [isTypingBot, setIsTypingBot] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const lastMsgRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    lastMsgRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    mode: "onChange",
  });
  const onSubmit = async (data: FormData) => {
    setMessages((prev) => [...prev, { content: data.prompt, role: "user" }]);
    const params = { ...data, conversationId: crypto.randomUUID() };
    setIsTypingBot(true);
    reset();
    await axios
      .post("/api/chat", params)
      .then((res) => {
        console.log(res);
        setMessages((prev) => [
          ...prev,
          { content: res.data.message, role: "bot" },
        ]);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setIsTypingBot(false);
      });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {messages.length > 0 && (
        <div className="flex flex-col flex-1 gap-y-3 p-2 overflow-y-auto pb-12">
          {messages.map((message: Message, index: number) => (
            <p
              key={index}
              className={`${
                message.role === "user"
                  ? "bg-blue-400 text-white self-end"
                  : "bg-gray-100 self-start text-left"
              } p-4 rounded-4xl`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </p>
          ))}
          <div ref={lastMsgRef}></div>
        </div>
      )}
      {isTypingBot && (
        <div className="flex items-center gap-1 my-4 ml-4">
          <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }
        }}
        className="h-32 flex flex-col gap-y-2 items-start border-2 p-2 rounded-3xl border-gray-200 mt-2"
      >
        <textarea
          placeholder="Ask anything"
          className="w-full p-2 resize-none border-none outline-none focus:outline-none shadow-none"
          {...register("prompt", { required: true })}
        />
        <Button className="self-end cursor-pointer" disabled={!isValid}>
          Send
        </Button>
      </form>
    </div>
  );
};
