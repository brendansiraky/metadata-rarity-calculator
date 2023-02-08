import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Inter } from '@next/font/google'
import metadataEntries from '../../metadata.json'

import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

type Rarity = {
    rarity: string
    count: number
}

type Tables = {
    background: {
        [key: string]: Rarity
    }
    base: {
        [key: string]: Rarity
    }
    eyes: {
        [key: string]: Rarity
    }
    body: {
        [key: string]: Rarity
    }
    head: {
        [key: string]: Rarity
    }
}

export default function Home() {
    const [tableData, setTableData] = useState<Tables | null>(null)

    useEffect(() => {
        const tableData = getTableData()
        setTableData(tableData)
    }, [])

    function getCount(metadata: typeof metadataEntries, traitType: keyof typeof metadataEntries[0], traitValue: string) {
        let count = 0;
        for (let i = 0; i < metadata.length; i++) {
            if (metadata[i][traitType] === traitValue) {
                count = count + 1
            }
        }

        return count
    }

    function getTraitValue(metadata: typeof metadataEntries, traitType: keyof typeof metadataEntries[0], traitValue: string) {
        const count = getCount(metadata, traitType, traitValue)
        
        return {
            rarity: `${Number((count / metadataEntries.length) * 100).toFixed(2)}%`,
            count,
        }
    }

    function getTableData() {
        
        const reduced = metadataEntries.reduce((acc, cur) => {
            
            if (!acc.background[cur.background]) {
                const obj = getTraitValue(metadataEntries, 'background', cur.background)
                acc.background[cur.background] = obj
            }

            if (!acc.base[cur.base]) {
                const obj = getTraitValue(metadataEntries, 'base', cur.base)
                acc.base[cur.base] = obj
            }

            if (!acc.eyes[cur.eyes]) {
                const obj = getTraitValue(metadataEntries, 'eyes', cur.eyes)
                acc.eyes[cur.eyes] = obj
            }

            if (!acc.body[cur.body]) {
                const obj = getTraitValue(metadataEntries, 'body', cur.body)
                acc.body[cur.body] = obj
            }

            if (!acc.head[cur.head]) {
                const obj = getTraitValue(metadataEntries, 'head', cur.head)
                acc.head[cur.head] = obj
            }

            return acc
        }, {
            background: {},
            base: {},
            eyes: {},
            body: {},
            head: {},
        } as Tables)

        return reduced
    }
    
    return (
        <>
            <Head>
                <title>Metadata Rarity Calculator</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1 className={inter.className}>Metadata Rarity Calculator</h1>
                <table>
                    {tableData && Object.entries(tableData).map(([traitType, value]) => (
                        <tbody key={traitType}>
                            <tr>
                                <th><h2 className={inter.className}>{traitType}</h2></th>
                                <th><h2 className={inter.className}>rarity</h2></th>
                                <th><h2 className={inter.className}>count</h2></th>
                            </tr>
                            {Object.entries(value).sort().map(([traitKey, traitRarity]) => (
                                <tr key={traitKey}>
                                    <td>{traitKey}</td>
                                    <td>{traitRarity.rarity}</td>
                                    <td>{traitRarity.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    ))}
                </table>
            </main>
        </>
    )
}
