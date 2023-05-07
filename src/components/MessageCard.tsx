import { ChatMessage } from "@/types";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw'
import { Theme } from '@/types';
import styles from "./MessageCard.module.css";


export interface MessageCardProps {
  theme: Theme;
  message: ChatMessage;
  editMessage: (messageId: number, content: string) => void;
}

export default function MessageCard({ theme, message, editMessage} : MessageCardProps) {
  console.log("MC RERENDER:", message.id);

  function editMessageCB() {
    editMessage(message.id, message.content + "ASDF");
  }

  return (
    <>
      <p>{theme}</p>
      <p>{message.role}</p>
      <ReactMarkdown rehypePlugins={[[rehypeHighlight, {detect: true, ignoreMissing: true}], rehypeRaw]}
                     components={markdownComps}
                     linkTarget="_new">
        {message.partial ? message.partial : message.content}
      </ReactMarkdown>
      <p>{`Tokens: ${message.tokens ?? "?"}`}</p>
      { message.role === "user" && <button onClick={editMessageCB}>EDIT</button> }
    </>
  )
}


/**
 * Extra modifications to nodes.
 * - Without an extra div, the background only appears behind text.
 * - Also lets us add copy/paste bar to code blocks.
 */
const markdownComps = {
  code: CodeBlock
}

function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
} : {
  node : object,
  inline?: boolean,
  className?: string,
  children: React.ReactNode,
}) {
  return (
    inline
      ? <code className={className}{...props}>
         {children}
        </code>
      : <div className={`hljs ${styles.codeblock}`}>
          <code {...props} className={className}>
            {children}
          </code>
        </div>
  )
}
