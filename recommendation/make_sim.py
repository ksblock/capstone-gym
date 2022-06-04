import sys
import pandas as pd
import numpy as np
import warnings; warnings.filterwarnings('ignore')
from sklearn.metrics.pairwise import cosine_similarity

def main(input):
    print(input)
    # gyms = pd.read_csv('test3.csv', encoding='cp949')
    # input_df = pd.DataFrame(input, index=[gyms.shape[0]])
    # gyms = pd.concat([gyms,input_df])
    # print(gyms[-2:])
    # print(gyms.shape)
    gyms =pd.read_csv('recommendation/test3.csv', encoding='cp949')
    #
    # # print(gyms.shape)
    #
    dist = pd.read_csv('recommendation/dist_city.csv', encoding='cp949')
    index = pd.read_csv('recommendation/city_info.csv', encoding='cp949')
    dist = 1 - dist

    dist_sports = pd.read_csv('recommendation/dist_sports.csv', encoding='cp949')
    index_sports = pd.read_csv('recommendation/sports_info.csv', encoding='UTF8')
    dist_sports = (dist_sports + 1) /2

    gym_df1 = gyms[['city']]
    gym_df2 = gyms[['price', 'court', 'player']]
    gym_df3 = gyms[['sports']]

    gym_df2_norm = (gym_df2 - gym_df2.mean())/gym_df2.std()
    sim_cos = cosine_similarity(gym_df2_norm, gym_df2_norm)
    sim_cos = (sim_cos + 1) /2

    def cal_dist(g1, g2):
        idx1 = index.iloc[0][g1]
        return dist.iloc[idx1][g2]

    temp2 = np.zeros((len(gym_df1), len(gym_df1)))
    for i in range(len(gym_df1)):
      for j in range(len(gym_df1)):
        temp2[i][j] = cal_dist(gym_df1.iloc[i].city, gym_df1.iloc[j].city)

    sim_city = pd.DataFrame(temp2)
    print(sim_city.shape)

    def cal_dist_sports(g1, g2):
        idx2 = index_sports.iloc[0][g1]
        return dist_sports.iloc[idx2][g2]

    # print(dist_sports.iloc[5]["축구"])
    temp3 = np.zeros((len(gym_df3), len(gym_df3)))
    for i in range(len(gym_df3)):
      for j in range(len(gym_df3)):
        temp3[i][j] = cal_dist_sports(gym_df3.iloc[i].sports, gym_df3.iloc[j].sports)

    sim_sports = pd.DataFrame(temp3)
    print(sim_city.shape)

    sim = sim_city * 5 + sim_sports * 3 + sim_cos * 2

    sim_temp = sim.to_numpy()
    sim_sorted = sim_temp.argsort()[:, ::-1]

    sim_df = pd.DataFrame(sim_sorted)
    sim_df.to_csv("sim.csv", mode='w')

    def find_sim_gym(df, sorted_ind, gym_id, top_n=10):
        # 인자로 입력된 movies_df DataFrame에서 'title' 컬럼이 입력된 title_name 값인 DataFrame추출
        gym = df[df['id'] == gym_id]
        # print(gym)
        # title_named을 가진 DataFrame의 index 객체를 ndarray로 반환하고
        # sorted_ind 인자로 입력된 genre_sim_sorted_ind 객체에서 유사도 순으로 top_n 개의 index 추출
        gym_index = gym.index.values
        similar_indexes = sorted_ind[gym_index, :(top_n)]

        # 추출된 top_n index들 출력. top_n index는 2차원 데이터 임.
        # dataframe에서 index로 사용하기 위해서 1차원 array로 변경
        # print(similar_indexes)
        similar_indexes = similar_indexes.reshape(-1)

        return df.iloc[similar_indexes]

    similar_gyms = find_sim_gym(gyms, sim_sorted, 15,10)
    print(similar_gyms[['id', 'name', 'sports', 'city', 'price', 'court']])



# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    data = {
        'id': 88,
        'name': '테스트중임',
        'state': '서울특별시',
        'city': '종로구',
        'sports': '탁구',
        'price': 2000,
        'court': 5,
        'player': 4
    }
    main(data)
    # main(sys.argv[1])

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
