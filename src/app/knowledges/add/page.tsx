import Layout from "@/app/_components/layouts/Layout";
import Title from "@/app/_components/Title";
import KnowledgeAddForm from "./_components/KnowledgeAddForm";

export default function KnowledgeAdd() {
  return (
    <Layout>
      <main className="w-full px-5 pb-20 mx-auto mt-20 md:w-[1000px]">
        <section className="flex justify-between items-center">
          <Title>공간 지식 작성</Title>
        </section>
        <section>
          <KnowledgeAddForm />
        </section>
      </main>
    </Layout>
  );
}