const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
    const urls = extractUrls(message.message);
    const messageText = message.message;
  
    return (
      <div className="flex-shrink-0 space-y-2">
        <p className="text-[13px] whitespace-pre-wrap break-words">
          {messageText}
        </p>
        {urls.map((url, index) => (
          <LinkPreview key={`${url}-${index}`} url={url} />
        ))}
      </div>
    );
  };