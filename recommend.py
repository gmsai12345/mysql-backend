import sys
import json
import mysql.connector

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def get_recommendations(user_id):
    db = mysql.connector.connect(
        host='sql12.freesqldatabase.com',
        user='sql12801540',
        password='mfQbFZNDUi',
        database='sql12801540',
        port=3306
    )
    # Load user-book interactions
    query = '''
        SELECT user_id, book_id, COUNT(*) as rating
        FROM borrowings
        GROUP BY user_id, book_id
    '''
    df = pd.read_sql(query, db)
    if df.empty or user_id not in df['user_id'].values:
        db.close()
        return []
    # Create user-book matrix
    user_book_matrix = df.pivot(index='user_id', columns='book_id', values='rating').fillna(0)
    # Compute similarity
    sim = cosine_similarity(user_book_matrix)
    user_idx = list(user_book_matrix.index).index(user_id)
    sim_scores = sim[user_idx]
    # Find most similar user
    most_similar_idx = sim_scores.argsort()[-2]  # -2 to skip self
    similar_user_id = user_book_matrix.index[most_similar_idx]
    # Recommend books borrowed by similar user but not by current user
    user_books = set(df[df['user_id'] == user_id]['book_id'])
    similar_books = set(df[df['user_id'] == similar_user_id]['book_id'])
    recommend_ids = list(similar_books - user_books)
    if not recommend_ids:
        db.close()
        return []
    # Get book details
    format_ids = ','.join(str(bid) for bid in recommend_ids)
    books_query = f"SELECT * FROM books WHERE id IN ({format_ids}) LIMIT 5"
    books = pd.read_sql(books_query, db).to_dict(orient='records')
    db.close()
    return books

if __name__ == '__main__':
    user_id = int(sys.argv[1])
    recommendations = get_recommendations(user_id)
    print(json.dumps(recommendations))
