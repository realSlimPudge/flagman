import { DocumentWidget } from "@/widgets/DocumentWidget";

export default function ListDocks() {
  return (
    <section>
      <div
        className="w-10/12 mx-auto py-20
      "
      >
        <DocumentWidget
          status="signed"
          title="Подписанные документы"
          delay={0.1}
        />
        <DocumentWidget
          status="pending"
          title="Документы на ожидании"
          delay={0.2}
        />
        <DocumentWidget
          status="rejected"
          title="Отклоненные документы"
          delay={0.3}
        />
      </div>
    </section>
  );
}
