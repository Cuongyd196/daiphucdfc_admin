import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";

import { loadStyleAsync, loadScriptAsync } from "./utils";
import { truncate } from "lodash";

const ReportViewer = props => {
  const { reportId, reportApi, reportFile, reportName } = props;

  const viewer = React.useRef(null);
  const report = React.useRef(null);

  const [loading, setLoading] = React.useState(true);

  const viewerId = `reportViewer-${reportId}`;

  React.useEffect(() => {
    (async () => {
      await loadResources();
      await setupStimulsoft();

      previewReport();
    })();
  }, []);

  const previewReport = () => {
    createViewer();
    createReport();
  };

  const createViewer = () => {
    const options = new window.Stimulsoft.Viewer.StiViewerOptions();
    options.toolbar.viewMode = window.Stimulsoft.Viewer.StiWebViewMode.Continuous;
    options.toolbar.showOpenButton = false;
    options.toolbar.showSaveButton = false;
    options.toolbar.showAboutButton = false;
    options.toolbar.showDesignButton = false;
    options.toolbar.printDestination = window.Stimulsoft.Viewer.StiPrintDestination.Direct;

    options.exports.showExportToDocument = false;
    options.exports.showExportToPdf = false;
    options.exports.showExportToHtml = false;
    options.exports.showExportToHtml5 = false;
    options.exports.showExportToWord2007 = true;
    options.exports.showExportToExcel2007 = true;
    options.exports.showExportToCsv = false;
    options.exports.showExportToJson = false;
    options.exports.showExportToText = false;
    options.exports.showExportToOpenDocumentWriter = false;
    options.exports.showExportToOpenDocumentCalc = false;
    options.exports.showExportToPowerPoint = false;
    options.exports.showExportToImageSvg = false;

    viewer.current = new window.Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    viewer.current.renderHtml(viewerId);
    viewer.current.onLoadDocument = onLoadDocument;
  };

  const createReport = () => {
    report.current = new window.Stimulsoft.Report.StiReport();
    report.current.loadFile(reportFile);
    if (reportApi) {
      report.current.dictionary.databases.getByIndex(0).pathData = reportApi;
    }
    report.current.reportName = reportName;
    viewer.current.report = report.current;
  };

  const loadResources = async () => {
    await loadStyleAsync("/stimulsoft/css/stimulsoft.viewer.office2013.whiteblue.css");
    await loadScriptAsync("/stimulsoft/scripts/stimulsoft.reports.pack.js");
    await loadScriptAsync("/stimulsoft/scripts/stimulsoft.viewer.pack.js");
  };

  const setupStimulsoft = async () => {
    window.Stimulsoft.Base.StiLicense.loadFromFile("/reportDesign/license.key");
    window.Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("/reportDesign/vi.xml");
  };

  const onLoadDocument = () => {
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div id={viewerId} style={{ minHeight: 100 }} />
    </Spin>
  );
};

ReportViewer.propTypes = {
  reportId: PropTypes.string,
  reportApi: PropTypes.string,
  reportName: PropTypes.string,
  reportFile: PropTypes.string
};

ReportViewer.defaultProps = {
  reportName: "Báo cáo"
};

export default ReportViewer;
