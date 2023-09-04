import { Variants, motion } from "framer-motion";
import { TriangleToggle } from "./TriangleToggle";
import React, { Component, useEffect } from "react";

const variants: Variants = {
    open: {
        y: 1,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -20 },
        }
    },
    closed: {
        y: 0,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 }
        }
    }
};


type MenuItemProps = {
    marginL: string, marginR: string, directoryElm: string, elementIndex: string, hasDocsInside: boolean, hidden: boolean
}

export default class MenuItem extends React.Component<MenuItemProps, { isActive: boolean, classN: string, variantsOptions: Variants | undefined }> {

    constructor(props: MenuItemProps) {
        super(props);
    }

    state = {
        isActive: false,
        classN: "hidden",
        variantsOptions: undefined,
    };



    changeSubsVisibility(index: string) {
        const ulMenu = document.getElementById("ul-menu");
        if (ulMenu) {
            let menuChildren = ulMenu.children;
            let maxLength = 0;

            for (const menuChild of menuChildren) {
                if (menuChild.id.length > maxLength) {
                    maxLength = menuChild.id.length
                }
                // console.log(menuChild)
            }

            let isActive = super.state.isActive;
            if (!isActive) {

                for (const menuChild of menuChildren) {

                    let mChildId = menuChild.id;


                    console.log(mChildId.length)
                    if ((mChildId.startsWith(`${index}.`)) && (mChildId.length === (index.length + 2))) {

                        let visibleElement = document.getElementById(mChildId);
                        if (visibleElement) { visibleElement.className = 'li-menu' }
                    }

                }
            } else {

                for (const menuChild of menuChildren) {

                    let mChildId = menuChild.id;
                    console.log(mChildId.length)

                    if ((mChildId.startsWith(`${index}.`))) {

                        let visibleElement = document.getElementById(mChildId);
                        if (visibleElement) { visibleElement.className = 'hidden' }
                    }

                }
            }
        }

    }

    changeStates() {

        if (this.props.hidden) {

            this.setState({ classN: "hidden" });
            this.setState({ variantsOptions: undefined });
        } else {

            this.setState({ classN: "li-menu" });
            this.setState({ variantsOptions: variants })
        }
    }


    render() {


        return (
            <motion.li
                style={{ marginLeft: this.props.marginL }}
                className={this.state.classN}
                variants={this.state.variantsOptions}
                onClick={() => this.changeSubsVisibility(this.props.elementIndex)}
                id={this.props.elementIndex}

            >
                {this.props.hasDocsInside ?
                    (
                        (this.props.elementIndex.length === 1) ?
                            (
                                <>
                                    <div className="flex flex-row">
                                        <div className={`w-6 h-6 flex-shrink-0 content-center font-bold`} style={{ marginRight: `${this.props.marginR}` }}>{this.props.elementIndex}</div>
                                        <div className="w-20 h-5 ">
                                            {this.props.directoryElm}
                                        </div>
                                        <TriangleToggle isActive={this.state.isActive} indexLength={this.props.elementIndex.length} />
                                    </div>
                                </>
                            )
                            :
                            (
                                <>
                                    <div className="flex flex-row ml-3">
                                        <div className={`w-6 h-6 flex-shrink-0 content-center font-bold`} style={{ marginRight: `${this.props.marginR}` }}>{this.props.elementIndex}</div>
                                        <div className="w-20 h-5">
                                            {this.props.directoryElm}
                                        </div>
                                        <TriangleToggle isActive={this.state.isActive} indexLength={this.props.elementIndex.length} />
                                    </div>
                                </>

                            )
                    )
                    :
                    (
                        (this.props.elementIndex.length === 1) ?
                            (<div className="flex flex-row">

                                <div className={`w-6 h-6  flex-shrink-0  content-center font-bold`}>{this.props.elementIndex}</div>
                                <div className={`w-20 h-5`}>
                                    {this.props.directoryElm}
                                </div>

                            </div>
                            )
                            :
                            (
                                <div className="flex flex-row">

                                    <div className={`w-6 h-6 flex-shrink-0 content-center font-bold`} style={{ marginRight: `${this.props.marginR}` }}>{this.props.elementIndex}</div>
                                    <div className="w-20 h-5">
                                        {this.props.directoryElm}
                                    </div>

                                </div>
                            )

                    )
                }
            </motion.li>
        )
    }
}