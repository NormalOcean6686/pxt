/// <reference path="../lib/skillMap.d.ts" />
import * as React from "react";

import { connect } from 'react-redux';
import { dispatchSaveAndCloseActivity } from '../actions/dispatch';
import { SkillMapState } from '../store/reducer';
import { resolvePath, tickEvent } from "../lib/browserUtils";

import { Dropdown, DropdownItem } from "./Dropdown";
import { isActivityCompleted } from "../lib/skillMapUtils";
import { editorUrl } from "./makecodeFrame";

interface HeaderBarProps {
    activityOpen: boolean;
    showReportAbuse?: boolean;
    completedHeaderId?: string;
    dispatchSaveAndCloseActivity: () => void;
}

export class HeaderBarImpl extends React.Component<HeaderBarProps> {
    protected reportAbuseUrl = "https://github.com/contact/report-content";
    protected getSettingItems(): DropdownItem[] {
        const items: DropdownItem[] = [];
        if (this.props.showReportAbuse) {
            items.push({
                id: "report",
                label: "Report Abuse",
                onClick: (id: string) => window.open(this.reportAbuseUrl)
            })
        }

        return items;
    }

    render() {
        const { activityOpen, completedHeaderId } = this.props;
        const logoAlt = "MakeCode Logo";
        const organizationLogoAlt = "Microsoft Logo";

        const items = this.getSettingItems();

        return <div className="header">
            <div className="header-left">
                { activityOpen
                    ? <i className="icon arrow left" role="button" onClick={this.onBackClicked} />
                    : <div className="header-logo">
                        <img src={resolvePath("assets/logo.svg")} alt={logoAlt} />
                    </div>
                }
            </div>
            <div className="spacer" />
            <div className="header-right">
                {completedHeaderId && <div className="header-button" onClick={this.onSaveClicked}>
                    {lf("SAVE TO MY PROJECTS")}
                </div>}
                { items?.length > 0 && <Dropdown icon="setting" className="header-settings" items={items} /> }
                <div className="header-org-logo">
                    <img src={resolvePath("assets/microsoft.png")} alt={organizationLogoAlt} />
                </div>
            </div>
        </div>
    }

    onBackClicked = () => {
        tickEvent("skillmap.activity.back");
        this.props.dispatchSaveAndCloseActivity();
    }

    onSaveClicked = () => {
        const { completedHeaderId } = this.props;
        window.open(`${editorUrl}#skillmapimport:${completedHeaderId}`)
    }
}


function mapStateToProps(state: SkillMapState, ownProps: any) {
    if (!state) return {};

    let completedHeaderId: string | undefined;
    if (state.editorView?.currentHeaderId) {
        if (isActivityCompleted(state.user, state.editorView.currentMapId, state.editorView.currentActivityId)) {
            completedHeaderId = state.editorView.currentHeaderId;
        }
    }

    return {
        activityOpen: !!state.editorView,
        showReportAbuse: state.pageSourceStatus === "unknown",
        completedHeaderId
    }
}


const mapDispatchToProps = {
    dispatchSaveAndCloseActivity
};

export const HeaderBar = connect(mapStateToProps, mapDispatchToProps)(HeaderBarImpl);