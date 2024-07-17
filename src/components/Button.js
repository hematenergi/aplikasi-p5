import React from "react"

export const Button = ({ roleName, onClick, label, icon }) => {
  return (
    <div
      className="
        delay-100
        hover:-translate-y-1
        hover:ease-in-out
        duration-300
      "
    >
      <button
        onClick={onClick}
        className="
          px-4 py-3 w-full 
          flex gap-2 items-center justify-center 
          bg-white rounded-full 
          shadow-lg
          hover:shadow-mainColor/40
        "
      >
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </button>
    </div>
  )
}
