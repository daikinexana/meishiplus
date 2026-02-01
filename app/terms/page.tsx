import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "利用規約 | Meishi+",
  description: "Meishi+の利用規約",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 md:px-8 md:py-32">
          <h1 className="mb-12 text-4xl font-light text-gray-900 sm:text-5xl md:text-6xl">
            利用規約
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第1条（適用）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                本利用規約（以下「本規約」といいます。）は、Meishi+（以下「当サービス」といいます。）の利用条件を定めるものです。
                登録ユーザーの皆さま（以下「ユーザー」といいます。）には、本規約に従って、当サービスをご利用いただきます。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第2条（利用登録）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                当サービスの利用を希望する者（以下「登録希望者」といいます。）は、本規約に同意の上、当サービスの定める方法によって利用登録を申請するものとします。
              </p>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                当サービスは、登録希望者が以下のいずれかの事由に該当する場合、利用登録を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-base leading-relaxed text-gray-700 sm:text-lg">
                <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                <li>本規約に違反したことがある者からの申請である場合</li>
                <li>その他、当サービスが利用登録を相当でないと判断した場合</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第3条（ユーザーIDおよびパスワードの管理）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                ユーザーは、自己の責任において、当サービスのユーザーIDおよびパスワードを適切に管理するものとします。
              </p>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                ユーザーIDまたはパスワードが第三者に使用されたことによって生じた損害は、当サービスに故意または重大な過失がある場合を除き、当サービスは一切の責任を負わないものとします。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第4条（利用料金および支払方法）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                当サービスの利用料金は、当サービスが別途定め、当サービスが運営するウェブサイトに表示するとおりとします。
                当サービスは、当サービスが提供するサービスの内容を変更した場合、利用料金を変更することができるものとします。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第5条（禁止事項）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-base leading-relaxed text-gray-700 sm:text-lg">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当サービスの内容等、当サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
                <li>当サービス、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>当サービスによって得られた情報を商業的に利用する行為</li>
                <li>当サービスの運営を妨害するおそれのある行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>不正な目的を持って当サービスを利用する行為</li>
                <li>当サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
                <li>その他、当サービスが不適切と判断する行為</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第6条（当サービスの提供の停止等）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします。
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-base leading-relaxed text-gray-700 sm:text-lg">
                <li>当サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、当サービスが当サービスの提供が困難と判断した場合</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第7条（保証の否認および免責）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                当サービスは、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
              </p>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                当サービスに起因してユーザーに生じたあらゆる損害について、当サービスの故意または重過失による場合を除き、一切の責任を負いません。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第8条（サービス内容の変更等）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                当サービスは、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれに同意するものとします。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第9条（利用規約の変更）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                当サービスは以下の場合には、ユーザーの個別の同意を待たず、本規約を変更することができるものとします。
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-base leading-relaxed text-gray-700 sm:text-lg">
                <li>本規約の変更がユーザーの一般の利益に適合するとき</li>
                <li>本規約の変更が当サービスの利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第10条（個人情報の取扱い）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                当サービスの個人情報の取扱いについては、当サービスのプライバシーポリシーの定めるところによります。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第11条（通知または連絡）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                ユーザーと当サービスとの間の通知または連絡は、当サービスの定める方法によって行うものとします。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第12条（権利義務の譲渡の禁止）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                ユーザーは、当サービスの書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-light text-gray-900 sm:text-3xl">第13条（準拠法・裁判管轄）</h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                本規約の解釈にあたっては、日本法を準拠法とします。
              </p>
              <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                本サービスに関して紛争が生じた場合には、当サービスの本店所在地を管轄する裁判所を専属的合意管轄とします。
              </p>
            </section>

            <p className="mt-12 text-sm text-gray-500">
              制定日：2026年1月31日
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
