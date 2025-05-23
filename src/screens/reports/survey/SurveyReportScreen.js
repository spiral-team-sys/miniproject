import React from "react";
import appConfig, { adhocApp, eoeApp, hmerApp } from "../../../utils/appConfig/appConfig";
import EOE_SurveyReportScreen from "./eoe/EOE_SurveyReportScreen";
import Adhoc_SurveyReportScreen from "./adhoc/Adhoc_SurveyReportScreen";
import HVNMER_SurveyReportScreen from "./heinekenmer/HVNMER_SurveyReportScreen";
import Default_SurveyReportScreen from "./default/Default_SurveyReportScreen";
import _ from 'lodash';

const SurveyReportScreen = ({ navigation }) => {
    const renderContent = () => {
        switch (appConfig.APPID) {
            case eoeApp:
                return <EOE_SurveyReportScreen navigation={navigation} />
            case hmerApp:
                return <HVNMER_SurveyReportScreen navigation={navigation} />
            case adhocApp:
                return <Adhoc_SurveyReportScreen navigation={navigation} />
            default:
                return <Default_SurveyReportScreen navigation={navigation} />
        }
    }

    return (renderContent())
}
export default SurveyReportScreen;