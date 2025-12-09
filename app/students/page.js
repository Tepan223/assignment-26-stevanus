"use client";
import "@ant-design/v5-patch-for-react-19";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Card,
  Typography,
  Layout
} from "antd";

const { Title } = Typography;
const { Content } = Layout;

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      message.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let url = "/api/students";
      let method = "POST";
      let successText = "Siswa berhasil ditambahkan!";

      if (isEdit) {
        url = `/api/students/${selectedId}`;
        method = "PUT"; 
        successText = "Data siswa berhasil diperbarui!";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success(successText);
        form.resetFields();
        setIsModalOpen(false);
        setIsEdit(false);
        fetchStudents();
      } else {
        message.error("Gagal menyimpan data");
      }
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (res.ok) {
      message.success("Siswa berhasil dihapus!");
      fetchStudents();
    } else {
      message.error("Gagal menghapus");
    }
  };

  const openEditModal = (student) => {
    setIsEdit(true);
    setSelectedId(student.id);
    form.setFieldsValue(student);
    setIsModalOpen(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 80, align: "center" },
    { title: "Nama Siswa", dataIndex: "name", render: (text) => <b>{text}</b> },
    { title: "Kelas", dataIndex: "grade" },
    {
      title: "Aksi",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Hapus Data?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Batal"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger type="primary">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5", padding: "40px 20px" }}>
      <Content style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        
        <Card variant={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: "center" }}>
            <div>
              <Title level={3} style={{ margin: 0 }}>Manajemen Siswa</Title>
              <span style={{ color: "#888" }}>API Integration Assessment</span>
            </div>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => {
                setIsEdit(false);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              + Tambah Siswa
            </Button>
          </div>

          <Table 
            dataSource={students} 
            columns={columns} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Card>

      </Content>

      <Modal
        title={isEdit ? "Edit Siswa" : "Tambah Siswa Baru"}
        open={isModalOpen}
        onOk={handleSubmit}
        okText={isEdit ? "Simpan Perubahan" : "Simpan"}
        cancelText="Batal"
        onCancel={() => setIsModalOpen(false)}
        centered
      >
        <Form layout="vertical" form={form} style={{ marginTop: 20 }}>
          <Form.Item label="Nama Lengkap" name="name" rules={[{ required: true, message: "Nama wajib diisi" }]}>
            <Input placeholder="Contoh: Lionel Liauw" />
          </Form.Item>
          <Form.Item label="Kelas" name="grade" rules={[{ required: true, message: "Kelas wajib diisi" }]}>
            <Input placeholder="Contoh: 12 RPL" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}