"use client"
import React, { useState, useEffect } from 'react';
import { sampleSize, sample } from 'lodash';
import { Toaster, toast } from 'sonner'
import {Switch} from "@nextui-org/switch";
import {Checkbox} from "@nextui-org/checkbox";

interface Kanji {
  key: number;
  kanji: string;
  onyomi: string;
  kunyomi: string;
  translation: string;
}

export default function Home() {
  const [allKanji, setAllKanji] = useState<Kanji[]>([]);
  const [randomKanji, setRandomKanji] = useState<Kanji | null>(null);
  const [options, setOptions] = useState<Kanji[]>([]);
  const [onyomiChecked, setOnyomiChecked] = useState(true);
  const [kunyomiChecked, setKunyomiChecked] = useState(true);
  const [translationChecked, setTranslationChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStreak = localStorage.getItem('highestStreak');
      if (savedStreak !== null) {
        setHighestStreak(JSON.parse(savedStreak));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('highestStreak', JSON.stringify(highestStreak));
    }
  }, [highestStreak]);

  useEffect(() => {
    fetch('kanjis.json') // Replace with the actual path to kanjis.json
      .then(response => response.json())
      .then(data => {
        setAllKanji(data.kanjis);
        generateOptions(data.kanjis);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching kanjis:', error);
        setIsLoading(false);
      });
  }, []);

  const generateOptions = (kanjis: Kanji[]) => {
    const sampledKanjis = sampleSize(kanjis, 3);
    setOptions(sampledKanjis);
    setRandomKanji(sample(sampledKanjis) as Kanji);
  };

  const checkAnswer = (option: Kanji) => {
    if (option.key === randomKanji?.key) {
      toast.success(!order ? `${option.translation} は "${randomKanji.kanji}" です!` : `${option.kanji} は "${randomKanji.translation}" です!`);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) {
        setHighestStreak(newStreak);
      }
      generateOptions(allKanji);
    } else {
      toast.error(!order ? `${option.translation} は "${randomKanji?.kanji}" ではありません!` : `${option.kanji} は "${randomKanji?.translation}" ではありません!`);
      setStreak(0);
    }
  };

  const getEmojiForStreak = (streak: number): string => {
    if (streak >= 25) {
        return '🔥'; 
    } else if (streak >= 20) {
        return '😆'; 
    } else if (streak >= 15){
      return '😄'; 
    } else if (streak >= 10){
      return '😀'; 
    } else if (streak >= 5){
      return '🙂'; 
    } else if (streak >= 3){
      return '😌'; 
    } else if (streak > 0) {
        return '😯'; 
    } else {
        return '😶';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='relative' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className='absolute bottom-14 flex justify-center items-center flex-col gap-2'>
          <div className='flex justify-center items-center'>
            <span className='mx-2 text-center'>Kanji - Traducción</span>
            <label className="switch">
              <input type="checkbox" onChange={() => setOrder(!order)}/>
              <span className="slider"></span>
            </label>   
            <span className='mx-2 text-center'>Traducción - Kanji</span>  
          </div>
          <div>
            スコア: {streak} {getEmojiForStreak(streak)} 最高スコア: {highestStreak} ⭐
          </div>     
        </div>

        <div className='flex flex-wrap justify-center top-3 absolute'>
          <Checkbox className='mx-3' size='md' isSelected={onyomiChecked} checked={onyomiChecked} onChange={() => setOnyomiChecked(!onyomiChecked)}>
            おんよみ
          </Checkbox>
          <Checkbox className='mx-3' size='md' isSelected={kunyomiChecked} checked={kunyomiChecked} onChange={() => setKunyomiChecked(!kunyomiChecked)}>
            くんよみ
          </Checkbox>
          <Checkbox className='mx-3' size='md' isSelected={translationChecked} checked={translationChecked} onChange={() => setTranslationChecked(!translationChecked)}>
            いみ
          </Checkbox>
        </div>  
      <Toaster richColors/>
      <p className={`${order ? 'text-2xl p-8 text-center' : 'text-8xl p-11'} border-white border-solid rounded-md border-2 mb-5`}>
        {order ?
          (onyomiChecked && randomKanji?.onyomi ? randomKanji.onyomi : '') + 
          (kunyomiChecked && randomKanji?.kunyomi ? ' / ' + randomKanji.kunyomi : '') + 
          (translationChecked && randomKanji?.translation ? ' / ' + randomKanji.translation : '') 
          :
          randomKanji?.kanji 
        }
      </p>
      <div className='flex flex-wrap justify-center'>
        {options.map((option, index) => (
          <button className={`border-white border-solid rounded-md border-2 p-4 m-2 ${order ? 'text-6xl' : ''}`} key={index} onClick={() => checkAnswer(option)}>
            {order?
              option.kanji
              :
              (onyomiChecked && option?.onyomi ? option.onyomi : '') + 
              (kunyomiChecked && option?.kunyomi ? ' / ' + option.kunyomi : '') + 
              (translationChecked && option?.translation ? ' / ' + option.translation : '') 
            }
          </button>
        ))}        
      </div>

    </div>
  );
}