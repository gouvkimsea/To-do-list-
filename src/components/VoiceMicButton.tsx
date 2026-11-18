import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Mic, MicOff, Check, X } from 'lucide-react';
import {
  formatVoiceTranscript,
  isSpeechRecognitionSupported,
} from '../utils/todoLogic';

interface VoiceMicButtonProps {
  currentText: string;
  onUpdateText: (newText: string) => void;
  ariaLabel: string;
  compact?: boolean;
  accentColor?: string;
}

const SAMPLE_DICTATIONS = [
  'Follow up with design team',
  'Schedule dentist checkup',
  'Review quarterly budget',
];

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  currentText,
  onUpdateText,
  ariaLabel,
  compact = false,
  accentColor = '#C87D55',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [dictationDraft, setDictationDraft] = useState('');
  const recognitionRef = useRef<any>(null);
  const isSupported = useMemo(() => isSpeechRecognitionSupported(), []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  const applyDictation = (spokenText: string) => {
    const formatted = formatVoiceTranscript(currentText, spokenText);
    onUpdateText(formatted);
    stopRecognition();
    setShowPopover(false);
    setDictationDraft('');
  };

  const handleToggleMic = () => {
    if (showPopover) {
      stopRecognition();
      setShowPopover(false);
      return;
    }

    setShowPopover(true);

    if (!isSupported) {
      return;
    }

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      return;
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const result = event?.results?.[event.results.length - 1];
        const transcript = result?.[0]?.transcript || '';
        if (transcript) {
          setDictationDraft(transcript);
          if (result.isFinal) {
            applyDictation(transcript);
          }
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="relative inline-flex items-center shrink-0">
      <button
        type="button"
        onClick={handleToggleMic}
        aria-label={ariaLabel}
        aria-pressed={showPopover || isListening}
        title={
          isListening
            ? 'Listening... Click to stop'
            : 'Dictate task with voice'
        }
        className={`rounded-md flex items-center justify-center transition-colors cursor-pointer touch-manipulation ${
          compact ? 'w-3.5 h-3.5 p-0.5' : 'w-5 h-5 p-0.5'
        } ${
          showPopover || isListening
            ? 'text-white shadow-xs'
            : 'text-[#B5ADA3] hover:text-[#5A524A] hover:bg-[#F2EFE9]'
        }`}
        style={
          showPopover || isListening
            ? { backgroundColor: accentColor }
            : undefined
        }
      >
        {isListening ? (
          <MicOff className={compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        ) : (
          <Mic className={compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        )}
      </button>

      {showPopover && (
        <div
          role="dialog"
          aria-label="Voice dictation input"
          className="absolute right-0 bottom-full mb-1.5 z-30 w-52 sm:w-60 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#1E1B18] border border-[#E2DAD0] dark:border-[#38332E] rounded-xl shadow-xl p-2.5 text-left"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C623E] dark:text-[#D4A373] flex items-center gap-1">
              <Mic className="w-3 h-3" />
              {isListening ? 'Listening now...' : 'Voice Dictation'}
            </span>
            <button
              type="button"
              onClick={() => {
                stopRecognition();
                setShowPopover(false);
              }}
              aria-label="Close voice dictation"
              className="text-[#8A8279] hover:text-[#2F2B28] dark:hover:text-[#EDE8E1] p-0.5 rounded cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {!isSupported && (
            <div className="mb-2 p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#28231E] border border-[#EDE6DC] dark:border-[#38332E] text-[10px] text-[#7A7269] dark:text-[#B5ADA3] leading-snug">
              Speech recognition is not supported in this browser (Chrome, Edge, or Safari recommended). You can still choose a quick phrase or type below:
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (dictationDraft.trim()) {
                applyDictation(dictationDraft);
              }
            }}
            className="flex items-center gap-1 mb-2"
          >
            <input
              type="text"
              value={dictationDraft}
              onChange={(e) => setDictationDraft(e.target.value)}
              placeholder={isSupported ? 'Speak or type dictated task...' : 'Type dictated task...'}
              aria-label="Dictated task phrase"
              autoFocus
              className="flex-1 min-w-0 text-[11px] bg-[#FAF7F2] dark:bg-[#28231E] border border-[#DED8CE] dark:border-[#38332E] rounded-lg px-2 py-1 text-[#2F2B28] dark:text-[#EDE8E1] focus:outline-none focus:border-[#C87D55]"
            />
            <button
              type="submit"
              aria-label="Insert dictated task"
              className="w-6 h-6 rounded-lg text-white flex items-center justify-center shrink-0 cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>

          <div className="space-y-1">
            <span className="text-[9px] font-semibold text-[#9C948B] dark:text-[#80776D] block">
              Quick voice phrases:
            </span>
            <div className="flex flex-wrap gap-1">
              {SAMPLE_DICTATIONS.map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => applyDictation(phrase)}
                  className="text-[10px] bg-[#F5F1EB] dark:bg-[#28231E] hover:bg-[#EBE4DA] dark:hover:bg-[#38332E] text-[#4A433C] dark:text-[#D5CEC4] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer text-left truncate max-w-full"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
