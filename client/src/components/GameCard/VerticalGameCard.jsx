import { TimePlayedToHours } from "../../utils/helper-functions/TimeToHours";
import { AchivementsCompleted } from "../GetGameAchivements";
import placeholderImage from "../../assets/placeholder.svg";
import { BlurImage } from "../BlurImage/BlurImage";
import timeIcon from "../../assets/timeIcon.svg";
export const VerticalGameCard = ({ game: gameInfo }) => {
  const completed = AchivementsCompleted(gameInfo.achievements || []);
  const total = gameInfo.achievements?.length || 0;
  const progress = gameInfo.progressPercent || 0;

  return (
    <div className="flex flex-col text-white bg-[#0082FB] rounded-sm basis-1/5">
      <BlurImage
        src={gameInfo.banner_url}
        alt={`${gameInfo.name} banner`}
        placeholderSrc={placeholderImage}
        parentClassName="min-h-[138px] rounded-t-sm"
      />

      <div className="flex flex-col justify-between h-full w-full px-4 py-2 gap-2">
        {/* Icon + Title */}
        <div className="flex w-full items-center justify-center gap-2 sm:flex-col xl:flex-row">
          <BlurImage
            src={gameInfo.icon_url}
            alt={`${gameInfo.name} icon`}
            placeholderSrc={placeholderImage}
            className="size-6 rounded-sm"
          />

          <h1 className="text-lg font-header font-bold uppercase text-center min-h-[2.5rem] flex items-center justify-center">
            {gameInfo.name}
          </h1>
        </div>

        {/* Playtime */}

        <span className="flex flex-row items-start justify-center gap-1 grow whitespace-nowrap">
          <img
            src={timeIcon}
            alt="achivement icon"
            className="size-6 flex-shrink-0"
          />
          <p className="flex-shrink-0 whitespace-nowrap">
            {TimePlayedToHours(gameInfo.playtime)}
          </p>
        </span>

        {/* <p className="text-sm">{`${TimePlayedToHours(gameInfo.playtime)}`}</p> */}

        {/* Achievement Progress */}
        {total > 0 && (
          <div className="flex flex-col gap-1 text-sm lg:text-xs xl:text-sm w-full justify-end">
            <div className="flex flex-col md:flex-col xl:flex-row justify-between">
              <h2>Achievement Progress</h2>
              <p>{`${completed.length} of ${total}`}</p>
            </div>

            <div className="w-full max-w-[328px] h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-2.5 bg-blue-600 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
