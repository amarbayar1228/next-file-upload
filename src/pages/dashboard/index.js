import { useState, useEffect } from "react";
import {
  Select,
  Image,
  Button,
  Row,
  Col,
  Progress,
  Modal,
  Form,
  Input,
  Divider,
} from "antd";
import axios from "axios";
import { Upload, message } from "antd";

// import { useSession } from "next-auth/client";
const { Dragger } = Upload;
const Dashboard = (props) => {
  const [fileList, setFileList] = useState([]);
  const [progress, setProgress] = useState(0);

  const [preview, setPreview] = useState();

  const [contentId, setContentId] = useState(0);

  const [imageName, setImageName] = useState("");
  

  const [previewVisible, setPreviewVisible] = useState(false);

  const [assetType, setAssetType] = useState();
  const [assetFileTypeId, setAssetFileTypeId] = useState(0);
  const [uploadingStatus, setUploadingStatus] = useState(false);

  const [imageList, setImageList] = useState([]);

  const [replaceFileList, setReplaceFileList] = useState([]);

  const { Option } = Select;

  const [visible, setVisible] = useState(false);
  const [imageId, setImageId] = useState(0);

  const [editImageName, setEditImageName] = useState("");
  const [editImageDescription, setEditImageDescription] = useState("");
  // const [editFileType, setEditFileType] = useState("");
  const [editFileAssetName, setEditAssetName] = useState("");
  const [editAssetFileTypeId, setEditAssetFileTypeId] = useState(0);

  const [testAssetType, setTestAssetType] = useState([]);
  // const [posterForm] = Form.useForm();
  const [userId, setUserId] = useState(0);
//   const [session] = useSession();

  useEffect(() => {
    // if (!session) console.log("user not found ");
    // else {
    //   setUserId(session.user.user.id);
    // }
    // getImageList(props.contentId)
    // setContentId(props.contentId);
    assetTypeApi("Image");
  }, []);

  const getImageList = (id) => {
    axios.post("/api/v1/api/content/getImages", { contentId: id }).then(
      (result) => {
        let images = [];
        result.data.map( item => {
          images.push(Object.assign(item, { t: new Date()}))
        });
        setImageList(images);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const selectImage = (item) => {
    setVisible(true);
    setImageId(item.id);
    setEditImageName(item.name);
    setEditImageDescription(item.description);
    setEditAssetName(item.assetName);
    setEditAssetFileTypeId(item.assetId);
  };

  // picture upload
  const uploadFile = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      message.error(` Заавал зураг оруулна уу`);
      setFileList([]);
    } else {
      const fmData = new FormData();
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percent = Math.floor((event.loaded / event.total) * 100);
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => setProgress(0), 1000);
          }
          onProgress({ percent: (event.loaded / event.total) * 100 });
        },
      };
      fmData.append("file", file);
      const res = await axios.post(`/api/image-upload`, fmData, config);
      console.log("! result----------> ", res);
      if (res.status == 200) {
        message.success("Амжилтай файл хууллаа");
      }

      onSuccess("Ok");
      //setPreview(res.data.imagepath);
      // setPreview(res.data.fileUrl);
      setImageName(res.data);
      // setImageUrl(res.data.fileUrl);
      // setImageSize(res.data.size + "kb");
    }
  };
  const handleOnChange = ({ file, fileList, event }) => {
    setFileList(fileList);
  };

  const assetTypeApi = (value) => {
    axios.post("/api/v1/api/content/getAssetType", { type: value }).then(
      (result) => {
        setAssetType(
          result.data.map((item) => {
            return <Option key={item.ID}>{item.NAME}</Option>;
          })
        );
        //test
        setTestAssetType(result.data);
      },
      (error) => {
        console.log("error=> ", error);
      }
    );
  };

  const onChangeAssetType = (e) => {
    setAssetFileTypeId(e);
  };

  const onChangeEditAssetType = (e) => {
    setEditAssetFileTypeId(e);
  };

  const onFinish = (values) => {
    // message.success("Submit success!", values);

    if (imageName === "") message.warning("Зураг оруул!");
    else if (assetFileTypeId === 0) {
      message.warning("Төрөл сонгож оруулна уу! ");
    } else {
      let data = {
        contentId: contentId,
        name: imageName,
        description: values.description,
        assetId: assetFileTypeId,
        userId: userId,
      };
      axios.post("/api/v1/api/content/saveAsset", data).then(
        (result) => {
          message.success("Файл амжилттай хадгаллаа. ");

          // props.getImageList();
          getImageList(props.contentId)
          if (result.status == 200) {
            setImageName("");
            setFileList([]);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  //update image
  const updateImage = () => {
    if (editImageName === "") message.warning("Зурагны нэр оруулна уу");
    else if (editAssetFileTypeId === 0)
      message.warning("Төрөл сонгож оруулна уу");
    else {
      let data = {
        id: imageId,
        name: editImageName,
        description: editImageDescription,
        assetId: editAssetFileTypeId,
      };

      axios.post("/api/v1/api/content/updateAsset", data).then(
        (result) => {
          if (result.status == 200) {
            message.success("Зураг амжилттай шинэчиллээ. ");
            // setEditImageName("");
            setReplaceFileList([]);
            setEditAssetFileTypeId(0);
            getImageList(props.contentId)
            console.log("contentId--------------->", contentId);
          }
        },
        (error) => {
          console.log(error);
        }
      );

      // setVisible(false);
    }
  };

  // picture upload
  const replaceImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    if (
      file.type !== "image/png" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/jpg"
    ) {
      message.error(` Заавал зураг оруулна уу`);
      setReplaceFileList([]);
    } else {
      const fmData = new FormData();
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percent = Math.floor((event.loaded / event.total) * 100);
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => setProgress(0), 1000);
          }
          onProgress({ percent: (event.loaded / event.total) * 100 });
        },
      };
      fmData.append("file", file);
      // fmData.append("description", editImageDescription);
      // fmData.append("assetType", editAssetFileTypeId);

      try {
        const res = await axios.post(
          `/api/content/image-replace?file=${editImageName}&editImageDescription=${editImageDescription}&editAssetFileTypeId=${editAssetFileTypeId}&imageId=${imageId}`,
          fmData,
          config
        );

        onSuccess("Ok");
        
        let images = imageList.filter(item => {
          return item.name === editImageName
        });
        if (images.length === 1) {
          // i.name, i.., i.t
          images[0].t = new Date();
          //images[0] = Object.assign(images[0], )
        }
        
        setImageList(imageList);
        setEditImageName(res.data);
        // props.getImageList();
        getImageList(props.contentId)
        message.success("Амжилтай файл хууллаа");
      } catch (err) {
        const error = new Error("Some error");
        onError({ err });
      }
    }
  };
  const replaceOnChane = ({ file, fileList, event }) => {
    setReplaceFileList(fileList);
  };

  return (
    <>
      {process.env.CORE_URL}
      <Form
        form={props.posterForm}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item style={{ paddingBottom: "24px" }} label="Постерууд">
          <Image.PreviewGroup>
            {imageList.map((item) => {
              return (
                <Image
                  preview={false}
                  onClick={() => {
                    selectImage(item);
                  }}
                  style={{ padding: "2px" }}
                  height="200px"
                  key={item.id}
                  src={`/api/v1/getImage?file=${item.name}&${new Date()}`}
                ></Image>
              );
            })}
          </Image.PreviewGroup>
        </Form.Item>
        <Divider />

        <Form.Item
          label="Төрөл сонгох"
          name="assetType"
          rules={[
            {
              required: true,
              message: "Төрөл сонгож оруулна уу!",
            },
          ]}
        >
          <Select
            style={{ width: "100%", marginBottom: "16px" }}
            placeholder="Төрөл сонгох"
            onChange={onChangeAssetType}
          >
            {testAssetType.map((item) => (
              <Option key={item.ID}>{item.NAME}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Нэр оруулах"
          name="description"
          rules={[
            {
              required: true,
              message: "Нэр оруулна уу!",
            },
          ]}
        >
          <Input placeholder="Зурагны нэр" />
        </Form.Item>

        <Form.Item label="Зураг сонгох">
          <Modal
            visible={previewVisible}
            title={imageName}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <Image
              style={{ width: "150px" }}
              src={`/api/v1/getImage?file=${imageName}`}
            />
          </Modal>

          <Upload
            style={{ display: "flex" }}
            multiple={false}
            accept="jpg"
            customRequest={uploadFile}
            onChange={handleOnChange}
            listType="picture-card"
            fileList={fileList}
            onRemove={null}
            onPreview={() => setPreviewVisible(true)}
          >
            {fileList.length >= 1 ? null : "Зураг нэмэх"}
          </Upload>
          {progress > 0 ? <Progress percent={progress} /> : null}
        </Form.Item>
      </Form>
      <Modal
        title="Дэлгэрэнгүй"
        centered
        visible={visible}
        onOk={updateImage}
        onCancel={() => setVisible(false)}
        width={1000}
        footer={[
          <Button key="3" style={{ float: "left" }}>
            <Upload
              multiple={false}
              accept="*/"
              customRequest={replaceImage}
              onChange={replaceOnChane}
              showUploadList={false}
            >
              Зураг оруулах
            </Upload>
          </Button>,
          <Button
            key="1"
            // style={{ float: "right" }}
            onClick={() => setVisible(false)}
          >
            {"Цуцлах"}
          </Button>,

          <Button
            key="2"
            type="primary"
            onClick={() => {
              updateImage(), setVisible(false);
            }}
          >
            {"Хадгалах "}
          </Button>,
        ]}
      >
        <Row>
          <Col
            span={12}
            style={{
              display: "block",
              textAlign: "center",
              paddingRight: "12px",
            }}
          >
            <Image
              height="370px"
              src={`/api/v1/getImage?file=${editImageName}&${new Date()}`}
            ></Image>
          </Col>

          <Col span={12} style={{ paddingLeft: "12px" }}>
            <Row>
              <h4>Зурагны нэр</h4>
              <Input
                value={editImageDescription}
                onChange={(e) => {
                  setEditImageDescription(e.target.value);
                }}
                placeholder="Зурагны нэр"
              />
            </Row>

            <Row>
              <h4>Төрөл</h4>
              <Select
                defaultValue={editFileAssetName}
                style={{ width: "100%", marginBottom: "16px" }}
                placeholder="Төрөл сонгох"
                onChange={onChangeEditAssetType}
              >
                {testAssetType.map((item) => (
                  <Option key={item.ID}>{item.NAME}</Option>
                ))}
              </Select>
            </Row>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Dashboard;