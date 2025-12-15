import React, { useState, useEffect } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [awaitingYesNo, setAwaitingYesNo] = useState(false);

  const allQuestions = [
    { id: 1, q: "What is sustainable farming?", a: "Sustainable farming focuses on eco-friendly practices like crop rotation, composting, and water conservation." },
    { id: 2, q: "What is organic farming?", a: "Organic farming avoids chemical fertilizers and pesticides and uses natural alternatives." },
    { id: 3, q: "What is crop rotation?", a: "Crop rotation is growing different crops in different seasons to improve soil health." },
    { id: 4, q: "What is smart farming?", a: "Smart farming uses IoT, sensors, automation, and data analytics to improve farming efficiency." },
    { id: 5, q: "What is drip irrigation?", a: "Drip irrigation delivers water directly to plant roots, reducing water wastage." },
    { id: 6, q: "What is precision farming?", a: "Precision farming applies water and fertilizers accurately using technology." },
    { id: 7, q: "What are soil sensors?", a: "Soil sensors measure moisture, nutrients, and temperature of soil." },
    { id: 8, q: "What is biogas?", a: "Biogas is renewable energy produced from organic waste like cow dung." },
    { id: 9, q: "What are solar pumps?", a: "Solar pumps use sunlight to pump water for irrigation." },
    { id: 10, q: "What is water conservation?", a: "Water conservation includes rainwater harvesting and efficient irrigation systems." }
  ];

  const [remainingQuestions, setRemainingQuestions] = useState(allQuestions);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "👋 Hi! I'm your Smart Farming Assistant.\n\nHere are some questions:\n" +
        allQuestions.slice(0, 5).map(q => `${q.id}. ${q.q}`).join("\n")
    }
  ]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const showNextQuestions = (list) => {
    if (list.length === 0) {
      return "No more questions available.\n\nType 'no' to end chat.";
    }

    return (
      "Here are more questions:\n" +
      list.slice(0, 5).map(q => `${q.id}. ${q.q}`).join("\n")
    );
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userInput = input.trim().toLowerCase();

    setMessages(prev => [...prev, { sender: "user", text: input }]);

    setTimeout(() => {
      let reply = "";

      if (awaitingYesNo) {
        if (userInput === "yes") {
          reply = showNextQuestions(remainingQuestions);
          setAwaitingYesNo(false);
        } else if (userInput === "no") {
          reply = "Thank you for chatting! 🌱 Have a great day!";
        } else {
          reply = "Invalid input ❌ Please type yes or no.";
        }
      } else {
        const selected = remainingQuestions.find(
          q => q.id.toString() === userInput
        );

        if (!selected) {
          reply = "Invalid input ❌ Please type a valid question number.";
        } else {
          reply = selected.a + "\n\nDo you want more questions? (yes/no)";
          setRemainingQuestions(prev =>
            prev.filter(q => q.id !== selected.id)
          );
          setAwaitingYesNo(true);
        }
      }

      setMessages(prev => [...prev, { sender: "bot", text: reply }]);
    }, 400);

    setInput("");
  };

  return (
    <div>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 text-white w-16 h-16
                   rounded-full shadow-xl text-2xl z-[9999]"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[420px] h-[500px]
                        bg-white rounded-2xl shadow-2xl border
                        flex flex-col z-[9999]">

          <div className="bg-green-600 text-white p-3
                          font-semibold flex justify-between  rounded-t-2xl">
            Smart Farming Chatbot
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-gray-100">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[75%]
                              whitespace-pre-line text-sm ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type number / yes / no"
              className="flex-1 border px-3 py-2 rounded-lg"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-green-600 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
