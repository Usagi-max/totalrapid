// FlexibleTable.jsx
import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./FlexibleTable.module.css";

const FlexibleTable = ({
  title = "サービス内容一覧",
  tableData = { headers: [], rows: [] },
  textColor = "#333",
  accentColor = "#f39700",
  bgColor = "#fff",
  highlightBgColor = "#fff8f0",
  hasShadow = true,
  minTableWidth = "800px",
}) => {
  if (!tableData || !Array.isArray(tableData.headers) || !Array.isArray(tableData.rows)) {
    console.error("Invalid tableData format. It must include 'headers' and 'rows' arrays.");
    return null;
  }

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

  useLayoutEffect(() => {
    if (!tableRef.current || !headers.length || !tableData.rows.length) return;

    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");
    ctx.font = "14px sans-serif";

    const calculated = headers.map((header, colIndex) => {
      if (!header.noWrap) return null;
      const texts = tableData.rows.map((r) => (r.data?.[colIndex] ? String(r.data[colIndex]) : ""));
      texts.push(header.label);
      const maxText = texts.reduce((a, b) => (a.length > b.length ? a : b), "");
      return ctx.measureText(maxText).width + 40;
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
        "--accent-color": accentColor,
      }}
    >
      <div
        className={styles.tableWrapper}
        style={{
          backgroundColor: bgColor,
          border: `1px solid ${accentColor}33`,
        }}
      >
        <h1
          style={{
            fontWeight: "bold",
            background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 auto 24px",
            textAlign: "center",
          }}
        >
          {title}
        </h1>

        <div
          className={styles.scrollContainer}
          style={{
            "--min-table-width": minTableWidth,
          }}
        >
          <table className={styles.table} ref={tableRef}>
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className={header.noWrap ? styles.nowrap : ""}
                    style={{
                      color: textColor,
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
                      borderLeft: isRecommend ? `4px solid ${accentColor}` : "4px solid transparent",
                    }}
                  >
                    {cells.map((cell, j) => (
                      <td
                        key={j}
                        className={headers[j]?.noWrap ? styles.nowrap : ""}
                        style={{
                          color: textColor,
                          width: headers[j]?.noWrap
                            ? `${columnWidths[j] ? columnWidths[j] + "px" : "auto"}`
                            : `${(headers[j]?.widthWeight / totalWeight) * 100}%`,
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
    </div>
  );
};

FlexibleTable.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.shape({
    headers: PropTypes.array,
    rows: PropTypes.array,
  }),
  textColor: PropTypes.string,
  accentColor: PropTypes.string,
  bgColor: PropTypes.string,
  highlightBgColor: PropTypes.string,
  hasShadow: PropTypes.bool,
  minTableWidth: PropTypes.string,
};

export default FlexibleTable;

