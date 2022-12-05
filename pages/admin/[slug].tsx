import styles from '../../styles/Admin.module.css';
import { doc, getFirestore, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { auth } from "../../lib/firebase";
import AuthCheck from '../../components/AuthCheck';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import ImageUploader from '../../components/ImageUploader';

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(getFirestore(), 'users', auth.currentUser!.uid, 'posts', slug!.toString());
  const [post] = useDocumentDataOnce(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className='btn-blue'>Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }: any) {
  const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset, watch } = useForm({ defaultValues, mode: 'onChange' });

  const updatePost = async ({ content, published }: any) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className='card'>
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          {...register('content',
            {
              maxLength: { value: 20000, message: 'content is too long' },
              minLength: { value: 10, message: 'content is too short' },
              required: { value: true, message: 'content is required' }
            }
          )}
        ></textarea>
        
        {errors.content && <p className='text-danger'>{errors.content.message?.toString()}</p>}

        <fieldset>
          <input className={styles.checkbox} type="checkbox" {...register("published")} />
          <label>Published</label>
        </fieldset>

        <button type='submit' disabled={!isDirty || !isValid} className='btn-green'>
          Save Changes
        </button>
      </div>
    </form>
  );
}