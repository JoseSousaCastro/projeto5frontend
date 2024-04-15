/*
-----USERS-----
- Contagem do número total de utilizadores (Stacked Area Chart com o ponto seguinte incluído)
- Contagem do número de utilizadores confirmados e não confirmados (Stacked Area Chart com o ponto anterior incluído)
- Gráfico que mostre o número de utilizadores registados ao longo do tempo (e.g. gráfico de linhas). Os utilizadores apagados podem ser excluídos desta contagem.
(Synchronized Area Chart - users apagados no de baixo)

-----TASKS-----
- Contagem do número de tarefas por estado (e.g. 5 em “DOING”, 2 em “DONE”, etc) (Percent Area Chart)
- Gráfico cumulativo que mostre o número total de tarefas concluídas ao longo do tempo. Tarefas apagadas podem ser excluídas desta contagem.
(Synchronized Area Chart - tarefas apagadas no de baixo)
- Contagem do número médio de tarefas por utilizador (label com o valor)
- Tempo médio que uma tarefa demora até ser concluída (data de conclusão é a última data em que a tarefa foi movida para “DONE”). (label com o valor)

-----CATEGORIES-----
- Listagem das categorias, ordenada da mais frequente (mais tarefas) à menos frequente


*/

import React, { useEffect, useState, PureComponent } from "react";
import "../DashboardMain/DashboardMain.css";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function DashboardMain() {


    return (
        <div className="DashboardMain">
            <div className="dashboard-main-container">

            </div>
        </div>
    )

}

export default DashboardMain;