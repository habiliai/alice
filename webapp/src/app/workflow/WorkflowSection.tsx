import LoadingSpinner from '@/components/LoadingSpinner';
import ProfileImage from '@/components/ProfileImage';
import { ActionWork, Step } from '@/proto/habapi';
import classNames from 'classnames';
import { Circle, CircleCheck } from 'lucide-react';
import { useMemo } from 'react';

export default function WorkflowSection({
  loading,
  actionWorks,
  stepsList,
  currentStepSeqNo,
  nowDisplayedStep,
  setNowDisplayedStep,
}: {
  loading: boolean;
  actionWorks: ActionWork.AsObject[];
  stepsList: Step.AsObject[];
  currentStepSeqNo: number;
  nowDisplayedStep: number;
  setNowDisplayedStep: (index: number) => void;
}) {
  const firstIncompleteIndex = useMemo(() => {
    return actionWorks.findIndex(({ done }) => !done);
  }, [actionWorks]);

  return (
    <div className="flex w-full flex-col gap-y-[0.875rem] lg:gap-y-[1.125rem]">
      <span className="text-2xl/[3.375rem] font-bold text-black">Workflow</span>
      {loading && <LoadingSpinner className="m-auto flex h-12 w-12" />}
      {!loading && (
        <div className="flex w-full flex-col gap-y-4 xl:px-20">
          <div className="w-fit bg-[#F1F5F9] p-[0.3125rem]">
            {stepsList.map((_, index) => (
              <WorkflowStepButton
                key={`workflow-step-${index}`}
                index={index + 1}
                currentStepSeq={currentStepSeqNo}
                isSelected={nowDisplayedStep === index + 1}
                onClick={() => setNowDisplayedStep(index + 1)}
              />
            ))}
          </div>
          <div className="flex w-full flex-col gap-1">
            {actionWorks.map(({ action, done }, index) => {
              const isCurrentProcess = !done && index === firstIncompleteIndex;
              return (
                <div
                  key={`workflow-task-${index}`}
                  className={classNames(
                    'rounded-[0.625rem] border-2 p-[0.125rem]',
                    {
                      'border-transparent': done || !isCurrentProcess,
                      'border-[#4AD15B]': !done && isCurrentProcess,
                    },
                  )}
                >
                  <div className="flex w-full items-center justify-between rounded-[0.625rem] border border-[#CBD5E1] py-[0.3125rem] pl-[1.875rem] pr-[0.3125rem]">
                    <div className="flex gap-[1.875rem]">
                      {done ? (
                        <CircleCheck className="text-black" />
                      ) : (
                        <Circle className="text-[#E2E8F0]" />
                      )}
                      <div className="flex gap-x-[0.875rem]">
                        <span className="line-clamp-1 text-sm/[1.375rem] font-normal">
                          {action?.subject}
                        </span>

                        <div
                          className={classNames(
                            'flex flex-shrink-0 items-center rounded-full border px-3 py-1',
                            {
                              'border-[#4AD15B] bg-[#DBFFE0]': done,
                              'border-[#FFE561] bg-[#FFF7CE]':
                                !done && isCurrentProcess,
                              hidden: !done && !isCurrentProcess,
                            },
                          )}
                        >
                          <span className="text-xs font-normal text-[#545454]">
                            {done ? 'Complete' : 'In progress'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex pl-[0.875rem]">
                      {action?.agent && (
                        <div className="relative size-10 overflow-hidden rounded-full">
                          <ProfileImage
                            alt={action?.agent.name}
                            src={action?.agent.iconUrl}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkflowStepButton({
  currentStepSeq,
  isSelected,
  index,
  onClick,
}: {
  currentStepSeq: number;
  isSelected: boolean;
  index: number;
  onClick?: () => void;
}) {
  return (
    <button
      className={classNames('rounded-[0.1875rem] px-[0.75rem] py-[0.375rem]', {
        'bg-white font-bold text-[#0F172A]': isSelected,
        'bg-transparent font-medium text-[#334155]': !isSelected,
        'cursor-not-allowed': index > currentStepSeq,
      })}
      onClick={() => {
        if (index > currentStepSeq) return;
        onClick?.();
      }}
    >
      Step {index}
    </button>
  );
}
