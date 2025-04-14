import { db } from './firebase';
import { getDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';

export async function getRelevantQuotesWithProjects(roles: string[]) {
  if (!roles.length) return [];

  const q = query(collection(db, 'quotes'), where('tag', 'in', roles));
  const quoteSnap = await getDocs(q);

  const items = await Promise.all(
    quoteSnap.docs.map(async (docSnap) => {
      const quote = docSnap.data();
      const projectSnap = await getDoc(doc(db, 'projects', quote.projectId));
      if (!projectSnap.exists()) return null;
      return {
        quote,
        project: { id: projectSnap.id, ...projectSnap.data() },
      };
    })
  );

  return items.filter(Boolean);
}
