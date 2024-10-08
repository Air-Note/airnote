'use client';

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CgProfile } from "react-icons/cg";
import { HiHandThumbUp, HiHandThumbDown } from "react-icons/hi2";
import { IoShareSocialSharp } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";

import { parseDate } from "@/utils/modules";
import { useKnowledge, useKnowledgeReaction } from "@/app/_lib/hooks";
import LoadingUI from "@/app/_components/LoadingUI";
import DefaultProfile from "@/app/_components/DefaultProfile";

export default function KnowledgeDetailMain({ knowledgeId }: PropsType) {
  const { data: session } = useSession();
  const { data: knowledge, isPending } = useKnowledge(knowledgeId);
  const { mutate: knowledgeLike } = useKnowledgeReaction(knowledgeId, 'like');
  const { mutate: knowledgeDislike } = useKnowledgeReaction(knowledgeId, 'dislike');

  const reactionClickHandler = (reactionType: 'like' | 'dislike') => {
    if (!session) {
      return alert('로그인 후 이용 가능합니다.');
    }
    if (reactionType === 'like') {
      knowledgeLike();
    } else {
      knowledgeDislike();
    }
  }
  
  if (!knowledge || isPending) {
    return <LoadingUI />;
  }
  
  return (
    <main className="w-full mx-auto mt-20 md:w-[1000px]">
      <section className="flex justify-between items-center text-middle-gray text-sm border-b-[1.5px] border-gray pb-2">
        <article className="flex justify-center items-center">
          <div>
            <DefaultProfile className="rounded-2xl" />
          </div>
          <div className="flex items-center">
            <div className="ml-2 text-base text-default font-bold">{knowledge.author_nickname}</div>
            <div className="flex items-center">
              <div>ㆍ</div>
              <div>{parseDate(knowledge.create_at)}</div>
            </div>
          </div>
        </article>
        <article className="flex justify-center items-center">
          <section className="flex justify-center items-center mr-5">
            <div className="flex items-center mr-2">
              <div>
                <HiHandThumbUp className="size-[20px] sm:size-[25px]" color="#AFAFAF" size="20" />
              </div>
              <div className="ml-1">{knowledge.likes}</div>
            </div>
            <div className="flex items-center">
              <div> 
                <HiHandThumbDown className="size-[20px] sm:size-[25px]" color="#AFAFAF" size="20" />
              </div>
              <div className="ml-1">{knowledge.dislikes}</div>
            </div>
          </section>
        </article>
      </section>
      <section className="flex justify-center items-center my-5 md:my-10">
        <Image
          className="w-[400px] h-[400px] object-cover rounded-lg"
          src={knowledge.thumbnail_url ? knowledge.thumbnail_url : '/airnote-thumbnail.jpg'}
          width={400}
          height={0}
          alt="썸네일"
        />
      </section>
      <section>
        <article className="text-2xl font-bold mb-5 md:text-3xl">{knowledge.knowledge_title}</article>
        <article className="knowledge-detail-container" dangerouslySetInnerHTML={{ __html: knowledge.knowledge_content }} />
      </section>
      <section className="mt-10 pb-20 text-sm">
        <article className="flex justify-center items-center">
          <button
            className="border-[1.5px] border-gray rounded-lg px-4 py-2 flex justify-center items-center"
            type="button"
            onClick={() => reactionClickHandler('like')}
          >
            <div className="mr-1">
              <HiHandThumbUp className="size-[15px] sm:size-[20px]" color="#AFAFAF" size="20" />
            </div>
            <div>추천</div>
          </button>
          <button
            className="bg-default rounded-lg text-white px-4 py-2 mx-3 flex justify-center items-center"
            type="button"
          >
            <div className="mr-1">
              <IoShareSocialSharp className="size-[15px] sm:size-[20px]" size={30} color="white" />
            </div>
            <div>공유</div>
          </button>
          <button
            className="border-[1.5px] border-gray rounded-lg px-5 py-2"
            type="button"
            onClick={() => reactionClickHandler('dislike')}
          >비추천</button>
        </article>
        <article className="text-end mt-5">
          <Link className="inline-block" href="/record">
            <div className="flex items-center">
              <div className="text-default mr-1">공간기록 보러가기</div>
              <div>
                <FaArrowRightLong className="size-[15px]" size={30} color="#4A68F5" />
              </div>
            </div>
          </Link>
        </article>
      </section>
    </main>
  );
}

interface PropsType {
  knowledgeId: string;
}