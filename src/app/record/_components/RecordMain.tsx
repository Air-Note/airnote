'use client'

import { FaListUl } from "react-icons/fa";
import { IoMapOutline } from "react-icons/io5";

import { useMapHandle, useSidebar } from "@/app/_lib/store";
import MapSection from "../../_components/map/MapSection";
import PanelSection from "./PanelSection";
import RecordSideBar from "./RecordSideBar";
import { useSearchParams } from "next/navigation";

export default function RecordMain() {
  const searchParams = useSearchParams();
  const { isMap, setIsMap } = useMapHandle();
  // 사이드바 로직 다시 생각
  const { isSidebar } = useSidebar();
  const querySidebar = searchParams?.get('sidebar');
  
  const isMapHandler = () => {
    setIsMap();
  }

  return (
    <>
      <button
        className="fixed bottom-[6vh] left-1/2 -translate-x-1/2 bg-default text-white text-sm px-4 py-2 rounded-full z-[30] md:hidden"
        type="button"
        onClick={isMapHandler}
      >{isMap ? (
          <div className="flex items-center">
            <FaListUl size={15} color="white" />
            <div className="ml-1">목록 보기</div>
          </div>
        ) : (
          <div className="flex items-center">
            <IoMapOutline size={15} color="white" />
            <div className="ml-1">지도 보기</div>
          </div>
        )}</button>
      <MapSection />
      {Boolean(querySidebar) ? (
        <>
          <div className="hidden md:block">
            <RecordSideBar />
          </div>
          <div className="block md:hidden">
            {!isMap && <RecordSideBar />}
          </div>
        </>
      ) : (
        <>
          <div className="hidden md:block">
            <PanelSection />
          </div>
          <div className="block md:hidden">
            {!isMap && <PanelSection />}
          </div>
        </>
      )}
    </>
  );
}
