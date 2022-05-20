import React, { FunctionComponent, ReactElement, ReactNode } from "react"
import ReactModal from "react-modal"
import styled from "styled-components"

import { CloseIcon as DefaultCloseIcon } from "./CloseIcon"

export interface ModalClassNames {
  modalContent?: string
  modalOverlay?: string
  modalHeader?: string
  modalSubheader?: string
  modalCloseButton?: string
  walletList?: string
  wallet?: string
  walletImage?: string
  walletInfo?: string
  walletName?: string
  walletDescription?: string
  textContent?: string
}

export interface BaseModalProps {
  isOpen: boolean
  onClose?: () => void

  title?: ReactElement | string
  maxWidth?: string

  classNames?: ModalClassNames
  closeIcon?: ReactNode
}

export const BaseModal: FunctionComponent<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  maxWidth = "36rem",
  classNames,
  closeIcon,
  children,
}) => (
  <ReactModal
    className={classNames?.modalContent ?? "_"}
    contentElement={(props, children) => (
      <ModalContent maxWidth={maxWidth} {...props}>
        {children}
      </ModalContent>
    )}
    isOpen={isOpen}
    onRequestClose={(e) => {
      e.preventDefault()
      onClose?.()
    }}
    overlayClassName={classNames?.modalOverlay ?? "_"}
    overlayElement={(props, children) => (
      <ModalOverlay {...props}>{children}</ModalOverlay>
    )}
  >
    {typeof title === "string" ? (
      <ModalHeader className={classNames?.modalHeader}>{title}</ModalHeader>
    ) : (
      title
    )}

    {onClose && (
      <ModalCloseButton
        className={classNames?.modalCloseButton}
        onClick={onClose}
      >
        {closeIcon ?? <DefaultCloseIcon height={26} width={26} />}
      </ModalCloseButton>
    )}
    {children}
  </ReactModal>
)

const ModalContent = styled.div<{ maxWidth: string }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 1.25rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  background: white;
  width: 100%;
  max-width: ${(props) => props.maxWidth};
  outline: none;
  cursor: auto;

  @media (max-width: 768px) {
    width: calc(100% - 40px);
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: cetner;
  cursor: pointer;
`

const ModalHeader = styled.div`
  color: rgb(31, 41, 55);
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1.75rem;
  margin-bottom: 1rem;
`

export const ModalSubheader = styled.div`
  color: rgb(31, 41, 55);
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.25rem;
`

const ModalCloseButton = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  cursor: pointer;
`
