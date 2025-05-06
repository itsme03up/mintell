import { Card, Table, Badge, Button } from "@/components/ui";

export default function MembersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">FCメンバー一覧</h1>
        <Button variant="secondary">非アクティブ:15日以上</Button>
      </div>
      <Card>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>名前</Table.Head>
              <Table.Head>最終ログイン</Table.Head>
              <Table.Head>進行度</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {/* APIからのデータを map で展開 */}
            <Table.Row>
              <Table.Cell>Minfilia</Table.Cell>
              <Table.Cell>2025/05/01</Table.Cell>
              <Table.Cell>
                <Badge variant="outline">EW_60</Badge>
              </Table.Cell>
            </Table.Row>
            {/* … */}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
}
