# Zynote - Akıllı Not Alma Uygulaması  
🔗 [Canlı Demo](https://zynote.vercel.app/)

## Proje Açıklaması
**Zynote**, yaratıcı ve üretken kullanıcılar için geliştirilmiş, modern ve fonksiyonel bir not alma uygulamasıdır. Yapay zeka destekli özetleme özelliği, görsel çizim alanı, renk ve etiket düzenlemeleriyle zenginleştirilmiş kullanıcı deneyimi sunar.

> Üretkenliği artırmak, not yönetimini kolaylaştırmak ve kişisel organizasyonu güçlendirmek için geliştirilmiştir.

## Kullanılan Teknolojiler
- **React.js** (Frontend)
- **Tailwind CSS** (Arayüz Tasarımı)
- **Node.js & Express.js** (Backend API)
- **MongoDB** (Veri Tabanı)
- **Cloudinary** (Görsel Upload)
- **Hugging Face API** (AI ile Not Özetleme)
- **JWT Authentication** (Kullanıcı Girişi)
- **Axios** (API İletişimi)
- **React Router** (Sayfa Yönetimi)

## Özellikler
- %100 Responsive, mobil uyumlu tasarım
- Kullanıcı girişi ve kayıt (JWT tabanlı auth sistemi)
- Notlara başlık, içerik, renk ve etiket ekleme
- Çizim yaparak not oluşturma özelliği (canvas alanı)
- Fotoğraf yükleme ve Cloudinary entegrasyonu
- Not arama ve sıralama
- AI destekli içerik özetleme (HuggingFace API)
- Modern, sade ve hızlı kullanıcı arayüzü
- SEO uyumlu yapı (meta tag’ler düzenlenmiş)

## Kurulum ve Çalıştırma

Projeyi lokal ortamınızda çalıştırmak için aşağıdaki adımları takip edin:

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/kullaniciadi/zynote.git
cd zynote
```
2. Client (Frontend)
```bash
Copy
Edit
cd client
npm install
npm run dev
```
3. Server (Backend)
```bash
Copy
Edit
cd server
npm install
npm run dev
```

4. Ortam Değişkenleri
server/.env dosyasını oluşturun ve aşağıdaki bilgileri doldurun:

```bash
env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
HUGGINGFACE_API_TOKEN=your_huggingface_token
```

##Ekran Görüntüleri
Aşağıdaki örnek ekran görüntülerini doğrudan README.md dosyasına GitHub linkleriyle veya görsellerle ekleyebilirsin.





Lisans
Bu proje yalnızca portföy ve tanıtım amaçlı geliştirilmiştir. Herhangi bir ticari kullanım için geliştiriciden izin alınması gerekmektedir.

🧑‍💻 Geliştirici: Mehmet Akif Tanyeri
📧 İletişim: 
mehmettanyeriiakif@hotmail.com
www.linkedin.com/in/mehmetakiftanyeri-382458351


