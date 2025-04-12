import { DocumentWidget } from "@/widgets/DocumentWidget";

export default function ListDocks() {
  return (
    <section>
      <div>
        <DocumentWidget status="pending" title="Ожидают подписи" />
        <DocumentWidget status="signed" title="Подписанные документы" />
        <DocumentWidget status="rejected" title="Отклоненные документы" />
      </div>
    </section>
  );
}
