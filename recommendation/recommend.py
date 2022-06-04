import os
import sys
import pandas as pd
import numpy as np
import warnings; warnings.filterwarnings('ignore')
from sklearn.metrics.pairwise import cosine_similarity

def main(idx):
    def find_sim_gym(df, sorted_ind, gym_id, top_n=10):
        # 인자로 입력된 movies_df DataFrame에서 'title' 컬럼이 입력된 title_name 값인 DataFrame추출
        gym = df[df['id'] == gym_id]

        # title_named을 가진 DataFrame의 index 객체를 ndarray로 반환하고
        # sorted_ind 인자로 입력된 genre_sim_sorted_ind 객체에서 유사도 순으로 top_n 개의 index 추출
        gym_index = gym.index.values
        similar_indexes = sorted_ind[gym_index, :(top_n)]

        # 추출된 top_n index들 출력. top_n index는 2차원 데이터 임.
        # dataframe에서 index로 사용하기 위해서 1차원 array로 변경
        # print(similar_indexes)
        similar_indexes = similar_indexes.reshape(-1)
        return similar_indexes
        return df.iloc[similar_indexes]

    gyms = pd.read_csv('recommendation/test3.csv', encoding='cp949')
    sim_df = pd.read_csv('recommendation/sim.csv', encoding='UTF8')
    sim_sorted = sim_df.to_numpy()

    idx = int(idx)
    similar_gyms = find_sim_gym(gyms, sim_sorted, idx,10)

    sim_text = ""
    for i in range(similar_gyms.shape[0]):
        sim_text += str(similar_gyms[i]) + " "

    print(sim_text)
    return similar_gyms



# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main(sys.argv[1])

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
