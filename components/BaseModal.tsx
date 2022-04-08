import React, { FunctionComponent, ReactElement } from "react";
import ReactModal, { setAppElement } from "react-modal";
import classNames from "classnames";
import CloseIcon from "./CloseIcon";

setAppElement("body");

export interface BaseModalProps {
  isOpen: boolean;
  onRequestClose: () => void;

  title?: ReactElement | string;
  className?: string;
  bodyOpenClassName?: string;
  overlayClassName?: string;
}

export const BaseModal: FunctionComponent<BaseModalProps> = ({
  isOpen,
  onRequestClose,
  title,
  className,
  bodyOpenClassName,
  overlayClassName,
  children,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={(e) => {
        e.preventDefault();
        onRequestClose();
      }}
      bodyOpenClassName={classNames("overflow-hidden", bodyOpenClassName)}
      overlayClassName={classNames(
        "z-50 fixed inset-0 bg-modalOverlay flex items-center justify-center",
        overlayClassName
      )}
      className={classNames(
        "absolute z-50 outline-none w-modal max-w-base-modal p-5 rounded-2xl flex flex-col bg-white dark:bg-dark",
        className
      )}
    >
      <div
        className="absolute top-5 right-5 cursor-pointer"
        onClick={() => onRequestClose()}
      >
        <CloseIcon
          className="text-gray-800 dark:text-gray-200"
          width={26}
          height={26}
        />
      </div>
      {typeof title === "string" ? (
        <h2 className="text-gray-800 dark:text-gray-200 text-xl font-bold mb-4">
          {title}
        </h2>
      ) : (
        title
      )}
      {children}
    </ReactModal>
  );
};
