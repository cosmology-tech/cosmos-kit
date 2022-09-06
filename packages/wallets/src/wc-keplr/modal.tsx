import React from "react";
import ReactDom from "react-dom";
import QRCode from 'qrcode.react';
import { Modal, ModalUIOptions } from "./modal-ui";

export class KeplrQRCodeModalV1 {
    protected readonly uiOptions?: ModalUIOptions

    constructor(uiOptions?: ModalUIOptions) { 
        this.uiOptions = uiOptions;
    }

    open(uri: string, cb: any) {
        const wrapper = document.createElement("div");
        wrapper.setAttribute("id", "keplr-qrcode-modal-v1");
        document.body.appendChild(wrapper);

        console.log(12, uri)

        ReactDom.render(
            // <QRCode
            //     size={500}
            //     value={uri}
            // />,
            <Modal
                uri={uri}
                close={() => {
                    this.close();
                    cb();
                }}
                uiOptions={this.uiOptions}
            />,
            wrapper
        );
    }

    close() {
        const wrapper = document.getElementById("keplr-qrcode-modal-v1");
        if (wrapper) {
            document.body.removeChild(wrapper);
        }
    }
}
