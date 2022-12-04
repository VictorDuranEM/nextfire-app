import { collectionGroup, doc, getDoc, getDocs, getFirestore, limit, query } from "firebase/firestore";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

export async function getStaticProps({ params }: { params: { username: string; slug: string } }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);
  
  let post;
  let path;
  
  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);
    
    post = postToJSON(await getDoc(postRef));
    
    path = postRef.path;
  }
  
  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  // TODO: Improve by using Admin SDK to select empty docs
  const q = query(
    collectionGroup(getFirestore(), 'posts'),
    limit(20)
  )
  const snapshot = await getDocs(q);
  
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });
  
  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug } }
    // ],
    paths,
    fallback: 'blocking',
  }
}

function Post() {
  return (
    <main>
      <h1>Post Page</h1>
    </main>
  );
}

export default Post;