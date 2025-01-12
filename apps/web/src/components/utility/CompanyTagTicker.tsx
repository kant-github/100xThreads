interface CompanyTagTickerProps {
    children: React.ReactNode;
    color?: string; // Optional color (CSS color format)
  }
  
  export default function CompanyTagTicker({ children, color }: CompanyTagTickerProps) {
    const fallbackColor = "#141313";
  
    const resolvedColor = color || fallbackColor;
  
    console.log("Resolved color is:", resolvedColor);
  
    return (
      <div>
        <div
          className={`flex items-center justify-center gap-x-1 text-[12px] font-medium rounded-full px-2.5 py-0.5 select-none transition duration-300 ease-in-out`}
          style={{
            color: resolvedColor,
            backgroundColor: `${resolvedColor}33`, // 20% opacity
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = `${resolvedColor}66`) // 40% opacity
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = `${resolvedColor}33`) // Reset to 20%
          }
        >
          {children}
        </div>
      </div>
    );
  }
  