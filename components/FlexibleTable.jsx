import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./FlexibleTable.module.css";

/**
 * 高さ・幅計測を行うテーブル
 */
const FlexibleTable = ({
  title = "サービス内容一覧",
  tableData = { headers: [], rows: [] },
  textColor = "#333",
  accentColor = "#f39700",
  bgColor = "#fff",
  highlightBgColor = "#fff8f0",
  hasShadow = true,
}) => {
  if (!tableData || !Array.isArray(tableData.headers) || !Array.isArray(tableData.rows)) {
    console.error("Invalid tableData format. It must include 'headers' and 'rows' arrays.");
    return null;
  }

  // ✅ useMemoでheadersをメモ化
  const headers = useMemo(
    () =>
      tableData.headers.map((h) =>
        typeof h === "string"
          ? { label: h, widthWeight: 1, noWrap: false }
          : { widthWeight: 1, noWrap: false, ...h }
      ),
    [tableData.headers]
  );

  const [columnWidths, setColumnWidths] = useState([]);
  const tableRef = useRef(null);

  // ✅ 幅計測
  useLayoutEffect(() => {
    if (!tableRef.current || !headers.length || !tableData.rows.length) return;

    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");
    ctx.font = "14px sans-serif";

    const calculated = headers.map((header, colIndex) => {
      if (!header.noWrap) return null;
      let texts = tableData.rows.map((r) => (r.data?.[colIndex] ? String(r.data[colIndex]) : ""));
      texts.push(header.label);
      let maxText = texts.reduce((a, b) => (a.length > b.length ? a : b), "");
      const width = ctx.measureText(maxText).width + 40;
      return width;
    });

    setColumnWidths((prev) => {
      const changed = JSON.stringify(prev) !== JSON.stringify(calculated);
      return changed ? calculated : prev;
    });
  }, [tableData.rows, headers]);

  const totalWeight = headers
    .map((h) => (h.noWrap ? 0 : h.widthWeight || 1))
    .reduce((a, b) => a + b, 0);

  return (
    <div
      className={styles.container}
      style={{
        "--accent-color": accentColor, // ✅ CSS変数として渡す
      }}
    >


      <div
        className={styles.tableWrapper}
        style={{
          backgroundColor: bgColor,
          boxShadow: hasShadow ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
          border: `1px solid ${accentColor}33`,
        }}
      >
        <h2
          style={{
            fontWeight: "bold",
      background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
      WebkitBackgroundClip: "text", // キャメルケースに
      WebkitTextFillColor: "transparent",
      display: "block",
      margin: "0 auto",
      fontSize: "1.8rem",
      textAlign: "center",
            
          }}
        >
          {title}
        </h2>
        <table className={styles.table} ref={tableRef}>
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  style={{
                    color: textColor,
                    whiteSpace: header.noWrap ? "nowrap" : "normal",
                    width: header.noWrap
                      ? `${columnWidths[i] ? columnWidths[i] + "px" : "auto"}`
                      : `${(header.widthWeight / totalWeight) * 100}%`,
                  }}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableData.rows.map((row, i) => {
              const isRecommend = row.recommend || false;
              const cells = Array.isArray(row.data) ? row.data : [];

              return (
                <tr
                  key={i}
                  className={isRecommend ? styles.recommendRow : ""}
                  style={{
                    backgroundColor: isRecommend ? highlightBgColor : bgColor,
                    borderLeft: isRecommend
                      ? `4px solid ${accentColor}`
                      : "4px solid transparent",
                  }}
                >
                  {cells.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        color: textColor,
                        whiteSpace: headers[j]?.noWrap ? "nowrap" : "normal",
                        wordBreak: headers[j]?.noWrap ? "keep-all" : "break-word",
                        overflowWrap: "anywhere",
                        width: headers[j]?.noWrap
                          ? `${columnWidths[j] ? columnWidths[j] + "px" : "auto"}`
                          : `${(headers[j]?.widthWeight / totalWeight) * 100}%`,
                        verticalAlign: "top",
                      }}
                    >
                      {cell}
                      {j === 0 && isRecommend && (
                        <>
                          <br />
                          <span className={styles.recommendInline}>おすすめ</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

FlexibleTable.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.shape({
    headers: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          widthWeight: PropTypes.number,
          noWrap: PropTypes.bool,
        }),
      ])
    ),
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.node).isRequired,
        recommend: PropTypes.bool,
      })
    ),
  }),
  textColor: PropTypes.string,
  accentColor: PropTypes.string,
  bgColor: PropTypes.string,
  highlightBgColor: PropTypes.string,
  hasShadow: PropTypes.bool,
};

export default FlexibleTable;
