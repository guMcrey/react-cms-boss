import { Button, Card, Space, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useGetArticles } from '@/apis/article/useArticle'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

const { Column } = Table

export const ArticleList = () => {
  const navigate = useNavigate()
  const { articleList, isLoading } = useGetArticles()

  return (
    <Card
      title="Article List"
      extra={
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            navigate('/article-create')
          }}
        >
          Create Article
        </Button>
      }
    >
      <Table loading={isLoading} dataSource={articleList}>
        <Column title="Title" dataIndex="title" key="title"></Column>
        <Column title="Author" dataIndex="author" key="author"></Column>
        <Column title="URL" dataIndex="url" key="url"></Column>
        <Column title="Description" dataIndex="description" key="description"></Column>
        <Column title="Tag" dataIndex="tag" key="tag"></Column>
        <Column title="Publish Time" dataIndex="publish_time" key="publish_time"></Column>
        <Column title="Publish Status" dataIndex="publish_status" key="publish_status"></Column>
        <Column
          title="Action"
          key="action"
          render={() => (
            <Space size="small">
              <Button type="primary" shape="circle" icon={<EditOutlined />} />
              <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
            </Space>
          )}
        ></Column>
      </Table>
    </Card>
  )
}
