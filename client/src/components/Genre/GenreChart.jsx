import React, { useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { GameCard } from "../GameCard/GameCard";
import { GamesOfGenre } from "./GamesOfGenre";
import { TagColors } from "../../utils/TagColors";

export const GenreChart = ({ sourceData, gamesInChart }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredLabel, setHoveredLabel] = useState(null);

  const handleHover = (event, chartElement) => {
    if (chartElement.length) {
      const index = chartElement[0].index;

      // Only trigger if it's a new hover
      if (hoveredIndex !== index) {
        setHoveredIndex(index);
        const hoveredLabel = sourceData[index].label;
        if (!hoveredLabel) return;
        setHoveredLabel(hoveredLabel);
      }
    } else if (hoveredIndex !== null) {
      // Reset when mouse leaves chart elements
      setHoveredIndex(null);
    }
  };

  return (
    <section className="xl:container mx-auto flex flex-col lg:flex-row gap-2 w-full items-center mb-8">
      <div className="basis-1/2 flex items-center justify-center  h-full max-h-56 lg:max-h-[430px] my-8">
        <Doughnut
          data={{
            labels: sourceData.map((data) => data.label),
            datasets: [
              {
                label: "Count",
                data: sourceData.map((data) => data.value),
                backgroundColor: TagColors,
                borderColor: TagColors,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
              },
              title: {
                display: false,
              },
            },
            // Adding onHover event handler
            onHover: (event, chartElement) => handleHover(event, chartElement),
          }}
        />
      </div>

      <GamesOfGenre gamesInChart={gamesInChart} hoveredLabel={hoveredLabel} />
    </section>
  );
};
