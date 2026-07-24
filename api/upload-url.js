import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const ALLOWED_TYPES = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream']
const ALLOWED_EXT = /\.(glb|gltf|stl|obj|fbx|usdz)$/i
const MAX_SIZE = 100 * 1024 * 1024 // 100 MB

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT } = process.env
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    return res.status(500).json({ error: 'R2 storage is not configured on the server' })
  }

  const { filename, contentType, size } = req.body || {}
  if (!filename || !ALLOWED_EXT.test(filename)) {
    return res.status(400).json({ error: 'Only 3D model files are allowed (.glb, .gltf, .stl, .obj, .fbx, .usdz)' })
  }
  if (size && size > MAX_SIZE) {
    return res.status(400).json({ error: 'File exceeds the 100 MB limit' })
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  })

  const safeName = filename.toLowerCase().replace(/[^a-z0-9._-]/g, '-')
  const key = `models/${Date.now()}-${safeName}`

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET || 'models',
    Key: key,
    ContentType: ALLOWED_TYPES.includes(contentType) ? contentType : 'application/octet-stream',
  })

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 })
  return res.status(200).json({ uploadUrl, key })
}
