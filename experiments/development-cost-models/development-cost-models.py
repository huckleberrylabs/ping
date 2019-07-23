
# coding: utf-8

# <h1>Development Cost Model</h1>

# <h2 style="background:#5fa6d2; padding:10px">Goal:</h2>
# <ul>
#     <li>To develop a general understanding of development costs</li>
#     <li>To gain insight into outsourcing opportunities</li>
# </ul>
# 
# <h4>Using Python, for each of the following filters:</h4>
# <ul>
#     <li>All Data</li>
#     <li>2016 vs 2017</li>
#     <li>Graduate vs Non-Graduate</li>
#     <li>Self-Employed vs Non Self-Employed</li>
#     <li>By x: Experience, y: CAD ->regression</li>
#     <li>Position Contains the Word (both lowecase and uppercase) Junior vs Senior</li>
#     <li>Position Contains the Words (both lowecase and uppercase) Software or Developer or Programator</li>
#     <li>Keywords Contains the words (both lowecase and uppercase) Node or NodeJS or TypeScript or JavaScript</li>
# </ul>
# <h4>please create the following artifacts:</h4>
# <ul>
#     <li>3 Frequency Distribution Graphs of the monthly salaries in CAD, with the following bin sizes: 200, 500, 1000;</li>
#     <li>3 Cumulative Distribution Graphs of the monthly salaries in CAD, with the following bin sizes: 200, 500, 1000;</li>
#     <li>Min, Max, Mean, Median of the monthly salaries in CAD.</li>
# </ul>

# In[59]:


import os
import pandas as pd
from pandas import DataFrame
import numpy as np
import glob

import matplotlib.pyplot as plt
# %matplotlib inline
import seaborn as sns
sns.set()

get_ipython().system('jupyter nbconvert --to script development-cost-models.ipynb')


# <h2 style="background:#86b7cf; padding:10px">Test Data</h2>

# In[37]:


def setup_result_dir():
    dirName='result'
    if not os.path.exists(dirName):
        os.mkdir(dirName)
        print("Directory " , dirName ,  " Created ")
    else:    
        print("Directory " , dirName ,  " already exists")
    if not os.path.exists('./result/temp'):
            os.mkdir('./result/temp')


# In[38]:


data_orig = pd.read_csv('./cash-it-data.csv')


# <h2 style="background:#adc7cc; padding:10px">Data Sorting Functions</h2>

# In[39]:


# all: All Data
# 16_vs_17: 2016 vs 2017
# grad_vs_ungrad: Graduate vs Non-Graduate
# self_vs_nonself: Self-Employed vs Non Self-Employed
# salary_vs_exp: Salary vs Experience Linear Regression
# junior_vs_senior: Position Contains the Word (both lowecase and uppercase) Junior vs Senior
# soft: Position Contains the Words (both lowecase and uppercase) Software or Developer or Programaor
# script: Keywords Contains the words (both lowecase and uppercase) Node or NodeJS or TypeScript or JavaScript


# In[40]:


def get_16():
    data = data_orig
    data['year']=data['Timestamp']
    data_16 = pd.DataFrame()
    data_16_index = []
    for i in range(len(data)):
        if data.iloc[i]['year'].split('-')[1] == '16':
            data_16_index.append(i)
    data_16 = data.iloc[data_16_index]
    return data_16

def get_17():
    data = data_orig
    data['year']=data['Timestamp']
    data_17 = pd.DataFrame()
    data_17_index = []
    for i in range(len(data)):
        if data.iloc[i]['year'].split('-')[1] == '17':
            data_17_index.append(i)
    data_17 = data.iloc[data_17_index]
    return data_17


# In[41]:


def get_grad():
    data = data_orig
    return data[data['Graduate'] == True]

def get_ungrad():
    data = data_orig
    return data[data['Graduate'] == False]


# In[42]:


def get_self():
    data = data_orig
    return data[data['PFA'] == True]

def get_nonself():
    data = data_orig
    return data[data['PFA'] == False]


# In[43]:


def get_junior():
    data = data_orig
    data['jnr']=data['Position']
    data_jnr = pd.DataFrame()
    data_jnr_index = []
    for i in range(len(data)):
        for j in data.iloc[i]['jnr'].split():
            if j.lower() == 'junior':
                data_jnr_index.append(i)
    data_jnr = data.iloc[data_jnr_index]
    return data_jnr

def get_senior():
    data = data_orig
    data['snr']=data['Position']
    data_snr = pd.DataFrame()
    data_snr_index = []
    for i in range(len(data)):
        for j in data.iloc[i]['snr'].split():
            if j.lower() == 'senior':
                data_snr_index.append(i)
    data_snr = data.iloc[data_snr_index]
    return data_snr


# In[44]:


def get_soft():
    data = data_orig
    data['soft']=data['Position']
    data_soft = pd.DataFrame()
    data_soft_index = []
    for i in range(len(data)):
        for j in data.iloc[i]['soft'].split():
            if j.lower() in ['software', 'developer', 'programator']:
                data_soft_index.append(i)
    data_soft = data.iloc[data_soft_index]
    return data_soft


# In[45]:


def is_nan(x):
    return (x is np.nan or x != x)
def get_script():
    web_developers=['javascript','js','script','angular','typescript','vue','react','node']
    data = data_orig
    data['script']=data['Keywords']
    data_script = pd.DataFrame()
    data_script_index = []
    for i in range(len(data)):
        if is_nan(data.iloc[i]['script']) == False:
            for j in web_developers:
                if data.iloc[i]['script'].lower().find(j) >= 0:
                    data_script_index.append(i)
                    break
    data_script = data.iloc[data_script_index]
    return data_script


# In[46]:


def draw_single(filter_type, data):
    part_1(filter_type,500,data)
    part_2(filter_type,data)
    part_3(filter_type,data)

def draw_double(filter_type, data1, data2):
    part_1_2(filter_type,500,data1,data2)
    part_2_2(filter_type,data1,data2)
    part_3_2(filter_type,data1,data2)


# In[47]:


def select_one(filter_type):
    if(filter_type == 'all'):
        data_all = data_orig
        draw_single(filter_type, data_all)
    elif(filter_type == '16_vs_17'):
        data_16 = get_16()
        data_17 = get_17()
        draw_double(filter_type, data_16, data_17)
    elif(filter_type == 'grad_vs_ungrad'):
        data_grad = get_grad()
        data_ungrad = get_ungrad()
        draw_double(filter_type, data_grad, data_ungrad)
    elif(filter_type == 'self_vs_nonself'):
        data_self = get_self()
        data_nonself = get_nonself()
        draw_double(filter_type, data_self, data_nonself)
    elif(filter_type == 'salary_vs_exp'):
        data_salary_vs_exp=data_orig
        cad_vs_exp(filter_type,data_salary_vs_exp)
    elif(filter_type == 'junior_vs_senior'):
        data_jnr = get_junior()
        data_snr = get_senior()
        draw_double(filter_type, data_jnr, data_snr)
    elif(filter_type == 'soft'):
        data_soft = get_soft()
        draw_single(filter_type, data_soft)
    elif(filter_type == 'script'):
        data_script = get_script()
        draw_single(filter_type, data_script)
    else:
        print('No such filter')
    return
    
        
    


# In[48]:


def get_all():
    filters = ['all','16_vs_17','grad_vs_ungrad','self_vs_nonself','salary_vs_exp','junior_vs_senior','soft','script']
    setup_result_dir()
    part_3_df = pd.DataFrame()
    print('Generating all graphs...')
    for i in filters:
        print('    - Generating ' + get_chart_info(i)[0] + '...')
        select_one(i)
    part_3_to_csv()
    print('All Graphs are generated in ./result folder!')


# In[60]:


chart_maps=[
    [
        'All Data',
        'all_data'
    ],
    [
        '2016 vs 2017',
        'by-years',
        '2016',
        '2017'
    ],
    [
        'Graduate vs Non-Graduate',
        'by-graduation',
        'Graduate',
        'Non-Graduate'
    ],
    [
        'Self-Employed vs Non Self-Employed',
        'by-employment-type',
        'Self-Employed',
        'Non Self-Employed'
    ],
    [
        'Salary vs Experience',
        'salary_vs_experience'
    ],
    [
        'Junior vs Senior',
        'by-level',
        'Junior',
        'Senior'
    ],
    [
        'Software Developers',
        'software-developers'
    ],
    [
        'Web Javascript Developers',
        'javascript-developers'
    ]
]

def get_chart_info(filter_type):
    if(filter_type == 'all'):
        return chart_maps[0]
    elif(filter_type == '16_vs_17'):
        return chart_maps[1]
    elif(filter_type == 'grad_vs_ungrad'):
        return chart_maps[2]
    elif(filter_type == 'self_vs_nonself'):
        return chart_maps[3]
    elif(filter_type == 'salary_vs_exp'):
        return chart_maps[4]
    elif(filter_type == 'junior_vs_senior'):
        return chart_maps[5]
    elif(filter_type == 'soft'):
        return chart_maps[6]
    elif(filter_type == 'script'):
        return chart_maps[7]
    else:
        return


# In[50]:


def part_3_to_csv():
    extension = 'csv'
    all_filenames = [i for i in glob.glob('./result/temp/*.{}'.format(extension))]
    combined_csv = pd.concat([pd.read_csv(f) for f in all_filenames ])
    combined_csv.rename(columns={'Unnamed: 0':'Category'},inplace=True)
    temp = np.arange(1,len(combined_csv)+1)
    for i in temp:
        combined_csv.index.values[i-1] = i
    combined_csv.to_csv( "./result/mean-min-mid-max_table.csv", index=False)


# <h2 style="background:#d4d7c9; padding:10px">Graphs</h2>

# In[51]:


def part_1 (filter_type,bin_size,data):
    chart_info = get_chart_info(filter_type)
    data = data.sort_values(by=['CAD'])
    data['cad_band'] = data['CAD'].astype(int)
    cad_min = data['CAD'].min()
    cad_max = data['CAD'].max()
    bin_number = int(cad_max/bin_size)+2

    x = []
    for i in range(bin_number):
        x.append(i*bin_size)
    ycount = []
    for j in range(bin_number-1):
        ycount.append(data.loc[(data['cad_band'] > x[j]) & (data['cad_band'] <= x[j+1])].shape[0])
    ycount.append(data.loc[(data['cad_band'] >= x[-1])].shape[0])

    percent = []
    display = []
    size = data.shape[0]
    for i in ycount:
        percent.append(i/size)
    width = x[1]-x[0]
    if(bin_size==200):
        plt.figure(figsize=(60,30))
    else:
        plt.figure(figsize=(20,10))
    for i in range(bin_number-1):
        x[i] = str(x[i]) + '-' + str(x[i+1])
    x[-1] = str(x[-1]) + '+'

    plt.bar(np.arange(bin_number), percent, width=0.5, align='center')
    plt.xticks(np.arange(bin_number),x)


    for a,b in enumerate(percent):
        plt.text(a,percent[a],"{:.1%}".format(b),horizontalalignment ='center')


    plt.xlabel('Monthly Salary (CAD)')
    plt.ylabel('Frequency Ratio')
    plt.title('Frequency Distribution Graph of Monthly Salary (CAD) for ' + chart_info[0] )
    plt.savefig('./result/' + chart_info[1] + '-frequency.png' )
    plt.close()


# In[52]:


def part_1_2 (filter_type, bin_size, data1, data2):
    chart_info = get_chart_info(filter_type)
    data1 = data1.sort_values(by=['CAD'])
    data2 = data2.sort_values(by=['CAD'])
    data1['cad_band'] = data1['CAD'].astype(int)
    data2['cad_band'] = data2['CAD'].astype(int)
    cad_max1 = data1['CAD'].max()
    cad_max2 = data2['CAD'].max()
    cad_max = 0
    if cad_max1 >= cad_max2:
        cad_max = cad_max1
    else:
        cad_max = cad_max2
    bin_number = int(cad_max/bin_size)+2

    x1 = []
    x2 = []
    for i in range(bin_number):
        x1.append(i*bin_size)
        x2.append(i*bin_size)
    ycount1 = []
    ycount2 = []
    for j in range(bin_number-1):
        ycount1.append(data1.loc[(data1['cad_band'] > x1[j]) & (data1['cad_band'] <= x1[j+1])].shape[0])
        ycount2.append(data2.loc[(data2['cad_band'] > x2[j]) & (data2['cad_band'] <= x2[j+1])].shape[0])
    ycount1.append(data1.loc[(data1['cad_band'] >= x1[-1])].shape[0])
    ycount2.append(data2.loc[(data2['cad_band'] >= x2[-1])].shape[0])
    
    percent1 = []
    size1 = data1.shape[0]
    percent2 = []
    size2 = data2.shape[0]
    
    for i in ycount1:
        percent1.append(i/size1)
    for i in ycount2:
        percent2.append(i/size2)
    width = x1[1]-x1[0]

    if(bin_size==200):
        plt.figure(figsize=(60,30))
    else:
        plt.figure(figsize=(20,10))

    for i in range(bin_number-1):
        x1[i] = str(x1[i]) + '-' + str(x1[i+1])
    x1[-1] = str(x1[-1]) + '+'

    ax = plt.subplot(111)
    ax.bar(np.arange(bin_number)-0.2, percent1, color='g', width=0.4, align='center', label=chart_info[2])
    ax.bar(np.arange(bin_number)+0.2, percent2, color='r', width=0.4, align='center', label=chart_info[3])
    plt.xticks(np.arange(bin_number),x1)
    for a,b in enumerate(percent1):
        plt.text(a-0.2,percent1[a],"{:.1%}".format(b),horizontalalignment ='center')
    for a,b in enumerate(percent2):
        plt.text(a+0.2,percent2[a],"{:.1%}".format(b),horizontalalignment ='center')

    plt.xlabel('Monthly Salary (CAD)')
    plt.ylabel('Frequency Ratio')
    plt.title('Frequency Distribution Graph of Monthly Salary (CAD) for ' + chart_info[0])
    plt.legend()
    plt.savefig('./result/' + chart_info[1] +'-frequency.png')
    plt.close()


# In[53]:


def cad_vs_exp (filter_type, data):
    chart_info = get_chart_info(filter_type)
    dataset = data[['CAD','years']]
    x=dataset['years']
    y=dataset['CAD']

    mx = x.mean()
    my = y.mean()
    temp = x - mx
    c1 = np.sum(temp * (y - my)) / np.sum(temp **2)
    c0 = my - c1 * mx

    x2 = [0,x.max()]
    y2 = [c0 + c1*0, c0 + c1*x.max()]
    func_line = 'y = ' + str(int(c1)) + 'x' + ' + ' + str(int(c0))
    plt.figure(figsize=(20,10), dpi=96)
    plt.scatter(x,y,color='b',s=20, label='dataset')
    plt.plot(x2,y2,color='r',linewidth=3, label=func_line)

    plt.xlabel('Experience (Years)')
    plt.ylabel('Monthly Salary (CAD)')
    plt.title('Linear Regression Graph of the Relationship for ' + chart_info[0])
    plt.legend()
    plt.savefig('./result/' + chart_info[1] + '.png')
    plt.close()


# In[54]:


def part_2 (filter_type, data):
    chart_info = get_chart_info(filter_type)
    x=np.sort(data['CAD'])
    y=np.arange(1,len(x)+1)/len(x)
    plt.figure(figsize=(20,10))
    plt.plot(x,y,marker='.',linestyle='none')
    plt.xlabel('Monthly Salary (CAD)')
    plt.ylabel('Cumulative Ratio')
    plt.margins(0.01)
    plt.title('Cumulative Distribution Graph of Monthly Salary (CAD) for ' + chart_info[0])
    plt.savefig('./result/' + chart_info[1] + '-cumulative.png')
    plt.close()


# In[55]:


def part_2_2 (filter_type, data1,data2):
    chart_info = get_chart_info(filter_type)
    x1=np.sort(data1['CAD'])
    y1=np.arange(1,len(x1)+1)/len(x1)
    x2=np.sort(data2['CAD'])
    y2=np.arange(1,len(x2)+1)/len(x2)
    plt.figure(figsize=(20,10))
    plt.plot(x1,y1,marker='.',color='g',linestyle='none', label=chart_info[2])
    plt.plot(x2,y2,marker='.',color='r',linestyle='none', label=chart_info[3])
    plt.xlabel('Monthly Salary (CAD)')
    plt.ylabel('Cumulative Ratio')
    plt.margins(0.01)
    plt.legend()
    plt.title('Cumulative Distribution Graph of Monthly Salary (CAD) for ' + chart_info[0])
    plt.savefig('./result/' + chart_info[1] + '-cumulative.png')
    plt.close()


# In[56]:


def part_3 (filter_type, data):
    chart_info = get_chart_info(filter_type)
    x=['mean','min','50%','max']
    y=data[['CAD']].describe().loc[['mean','min','50%','max']].astype(int)
    temp = y.T
    temp.rename(index={'CAD':chart_info[0]}, inplace=True)
    temp.to_csv('./result/temp/' + chart_info[1] + '_temp.csv')
    plt.figure(figsize=(20,10))
    plt.bar(np.arange(4), list(y['CAD']), width=0.4, align='center')
    plt.xticks(np.arange(4),['mean','min','50%','max'])
    for a,b in enumerate(y['CAD']):
        plt.text(a,b,y['CAD'][a],horizontalalignment ='center')
    plt.title('Min, Max, Mean, Median of Monthly Salary (CAD) for ' + chart_info[0])
    plt.xlabel('Key Values')
    plt.ylabel('Monthly Salary (CAD)')
    plt.savefig('./result/' + chart_info[1] + '-key-values.png')
    plt.close()


# In[57]:


def part_3_2 (filter_type, data1,data2):
    chart_info = get_chart_info(filter_type)
    x=['mean','min','50%','max']
    y1=data1[['CAD']].describe().loc[['mean','min','50%','max']].astype(int)
    y2=data2[['CAD']].describe().loc[['mean','min','50%','max']].astype(int)
    temp1 = y1.T
    temp2 = y2.T
    temp1.rename(index={'CAD':chart_info[2]}, inplace=True)
    temp2.rename(index={'CAD':chart_info[3]}, inplace=True)
    table = pd.concat([temp1,temp2])
    table.to_csv('./result/temp/' + chart_info[1] + '_temp.csv')
    plt.figure(figsize=(20,10))
    ax = plt.subplot(111)
    ax.bar(np.arange(4)-0.1, list(y1['CAD']), color='g', width=0.2, align='center', label=chart_info[2])
    ax.bar(np.arange(4)+0.1, list(y2['CAD']), color='r', width=0.2, align='center', label=chart_info[3])
    ax.set_xticklabels(['','mean','','min','','50%','','max'])

    for a,b in enumerate(y1['CAD']):
        plt.text(a-0.1,b,y1['CAD'][a],horizontalalignment ='center')
    for a,b in enumerate(y2['CAD']):
        plt.text(a+0.1,b,y2['CAD'][a],horizontalalignment ='center')
    plt.title('Min, Max, Mean, Median of Monthly Salary (CAD) for ' + chart_info[0])
    plt.xlabel('Key Values')
    plt.ylabel('Monthly Salary (CAD)')
    plt.legend()
    plt.savefig('./result/' + chart_info[1] + '-key-values.png')
    plt.close()


# <h2 style="background:#fbe8c6; padding:10px">Test</h2>

# In[61]:


get_all()

