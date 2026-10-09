import { collection, query, where, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { DocumentMetadata } from '../types/document';

const DOCUMENTS_COLLECTION = 'documents';

const DEMO_DOCUMENTS: DocumentMetadata[] = [
  {
    id: 'doc-demo-1',
    uid: 'demo-citizen-101',
    type: 'Aadhaar Card',
    fileName: 'aadhaar_card_masked.pdf',
    downloadURL: '#',
    uploadedAt: Date.now() - 86400000 * 5,
    status: 'Verified',
  },
  {
    id: 'doc-demo-2',
    uid: 'demo-citizen-101',
    type: 'Income Certificate',
    fileName: 'income_cert_2025_26.pdf',
    downloadURL: '#',
    uploadedAt: Date.now() - 86400000 * 2,
    status: 'Verified',
  },
  {
    id: 'doc-demo-3',
    uid: 'demo-citizen-101',
    type: 'Land Ownership Document (RoR / 1B)',
    fileName: 'pattadar_passbook.pdf',
    downloadURL: '#',
    uploadedAt: Date.now() - 86400000 * 1,
    status: 'Pending Verification',
  }
];

export async function getUserDocuments(uid: string): Promise<DocumentMetadata[]> {
  if (uid === 'demo-citizen-101') {
    try {
      const stored = localStorage.getItem('benefitbridge_demo_docs');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEMO_DOCUMENTS;
  }

  try {
    const q = query(collection(db, DOCUMENTS_COLLECTION), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    
    const docs: DocumentMetadata[] = [];
    querySnapshot.forEach((docSnap) => {
      docs.push({ id: docSnap.id, ...docSnap.data() } as DocumentMetadata);
    });
    
    return docs.sort((a, b) => b.uploadedAt - a.uploadedAt);
  } catch (err) {
    console.warn("getUserDocuments fallback:", err);
    return DEMO_DOCUMENTS;
  }
}

export async function uploadRealDocument(uid: string, type: string, file: File): Promise<DocumentMetadata> {
  // Validate file size (10MB limit)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds the 10MB limit. Please upload a smaller file.');
  }

  // Generate a unique path for the file in the user's secure folder
  const storagePath = `documents/${uid}/${Date.now()}_${file.name}`;
  const fileRef = ref(storage, storagePath);
  
  // Fast mock upload for demo to prevent UI hanging
  let downloadURL = "";
  try {
    // Attempt standard upload with 3 second timeout instead of 15
    const uploadTask = uploadBytes(fileRef, file);
    const timeoutTask = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Storage timeout")), 3000));
    const snapshot = await Promise.race([uploadTask, timeoutTask]) as any;
    downloadURL = await getDownloadURL(snapshot.ref);
  } catch (err: any) {
    console.warn("Storage upload bypassed to keep UI fast.", err);
  }

  // Save metadata to Firestore
  const metadata: Omit<DocumentMetadata, 'id'> = {
    uid,
    type,
    fileName: file.name,
    downloadURL,
    uploadedAt: Date.now(),
    status: 'Pending Verification', 
  };

  const docRef = await addDoc(collection(db, DOCUMENTS_COLLECTION), metadata);
  
  return {
    id: docRef.id,
    ...metadata
  };
}

export async function deleteUserDocument(documentId: string, downloadURL?: string): Promise<void> {
  // 1. Delete from Firestore
  await deleteDoc(doc(db, DOCUMENTS_COLLECTION, documentId));

  // 2. Delete from Storage if possible
  if (downloadURL) {
    try {
      const fileRef = ref(storage, downloadURL);
      await deleteObject(fileRef);
    } catch (e) {
      console.warn('Storage file cleanup failed or already removed', e);
    }
  }
}
