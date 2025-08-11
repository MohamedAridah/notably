"use client";

import DialogTriggerButton from "@/components/utils/dialog-trigger-button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function Test() {
  const [buttonState, setButtonState] = useState(false);

  const handleClick = () => {
    setButtonState((prev) => !prev);
  };

  return (
    <section className="max-w-7xl mx-auto my-10">
      <button
        className="mx-auto max-w-fit block bg-primary px-4 py-2 rounded-md text-white hover:cursor-pointer"
        onClick={handleClick}
      >
        Button Loading State
      </button>
      <div className="flex gap-4 my-4">
        <div className="flex flex-col gap-3 items-start">
          <p>Delete button with icon and text</p>
          <p>Case 01</p>
          <DialogTriggerButton
            variant="destructive"
            size="sm"
            state={buttonState}
            idleText="Delete"
            processText="Deleting"
            icon={Trash2}
          />
        </div>
        <div className="flex flex-col gap-3 items-start">
          <p>Delete button with no icon and text</p>
          <p>Case 02</p>
          <DialogTriggerButton
            withIcon={false}
            variant="destructive"
            size="sm"
            state={buttonState}
            idleText="Delete"
            processText="Deleting"
            icon={Trash2}
          />
        </div>
      </div>
      <div className="flex gap-4 my-4">
        <div className="flex flex-col gap-3 items-start">
          <p>Delete button icon only</p>
          <p>Case 03</p>
          <DialogTriggerButton
            asIcon={true}
            variant="destructive"
            size="sm"
            state={buttonState}
            idleText="Delete"
            processText="Deleting"
            icon={Trash2}
          />
        </div>
        <div className="flex flex-col gap-3 items-start">
          <p>Delete button icon only, initially hidden</p>
          <p>Case 04</p>
          <DialogTriggerButton
            asIcon={true}
            iconHidden={true}
            variant="destructive"
            size="sm"
            state={buttonState}
            idleText="Delete"
            processText="Deleting"
            icon={Trash2}
          />
        </div>
      </div>
    </section>
  );
}
