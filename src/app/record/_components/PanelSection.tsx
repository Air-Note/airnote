'use client'

import { FaArrowTrendUp } from "react-icons/fa6";

import { useTopRecords } from "@/app/_lib/hooks";
import PanelRecordCard from "./PanelRecordCard";
import PartLoadingUI from "@/app/_components/PartLoadingUI";
import MapMoveSection from "./MapMoveSection";

// TODO: 주소 기반 지도 위치 이동 구현
export default function PanelSection() {
  const { data: topRecords, isPending } = useTopRecords(6);

  return (
    <article
      id="panel"
      className="absolute top-[8vh] left-0 w-[100vw] h-[92vh] bg-white overflow-y-auto z-[28] md:top-[11vh] md:left-5 md:rounded-lg md:w-[400px] md:h-[84vh] md:shadow-lg"
    >
      {isPending ? <PartLoadingUI /> : (
        <>
          <MapMoveSection />
          <section className="min-h-[600px]">
            <section className="flex items-center p-3">
              <div>
                <FaArrowTrendUp size="25" color="#4A68F5" />
              </div>
              <div className="text-xl text-default font-bold ml-3">실시간 인기 공간기록</div>
            </section>
            <section className="mb-20 md:mb-0">
              {topRecords && topRecords.length ? topRecords.map((topRecord, idx) => {
                if (topRecords.length - 1 === idx) {
                  return <PanelRecordCard topRecord={topRecord} isLast={true} key={topRecord.post_id} />;
                } else {
                  return <PanelRecordCard topRecord={topRecord} isLast={false} key={topRecord.post_id} />;
                }
              }) : (
                <article className="text-lg text-center text-default font-bold mt-56">
                  <div>공간기록이 아직 존재하지 않습니다.</div>
                  <div>첫 공간기록을 작성해보세요.</div>
                </article>
              )}
            </section>
          </section>
        </>
      )}
    </article>
  );
}
