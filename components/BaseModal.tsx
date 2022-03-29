import React, { FunctionComponent, ReactElement } from "react";
import ReactModal, { setAppElement } from "react-modal";
import classNames from "classnames";

setAppElement("body");

export interface BaseModalProps {
  isOpen: boolean;
  onRequestClose: () => void;

  title?: ReactElement;
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
        "fixed flex items-center justify-center inset-0 bg-modalOverlay z-50",
        overlayClassName
      )}
      className={classNames(
        "absolute outline-none w-full p-5 bg-surface rounded-2xl z-50 flex flex-col max-w-modal",
        className
      )}
    >
      <div
        className="absolute top-5 right-5 cursor-pointer"
        onClick={() => onRequestClose()}
      >
        <img src="/close-icon.svg" alt="close icon" className="w-8 h-8" />
      </div>
      {title}
      {children}
    </ReactModal>
  );
};
