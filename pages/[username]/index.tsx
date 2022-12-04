import { collection, getDocs, getFirestore, limit, orderBy, query, where } from "firebase/firestore";
import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

type GetServerSidePropsContext = {
  query: {
    username: string;
  };
};

export async function getServerSideProps({ query: urlQuery }: GetServerSidePropsContext) {
  const { username } = urlQuery;

  const userDoc = await getUserWithUsername(username);

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

function UserProfilePage({ user, posts }: any) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}

export default UserProfilePage;