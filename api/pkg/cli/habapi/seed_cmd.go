package habapi

import (
	_ "embed"
	"github.com/habiliai/habiliai/api/pkg/digo"
	"github.com/habiliai/habiliai/api/pkg/domain"
	"github.com/habiliai/habiliai/api/pkg/services"
	"github.com/spf13/cobra"
	"gorm.io/gorm"
)

var (
	//go:embed data/templates/mission1_result.md.tmpl
	mission1ResultTemplate string
)

func (c *cli) newSeedCmd() *cobra.Command {
	flags := &struct {
		reset bool
	}{}

	cmd := &cobra.Command{
		Use:   "seed",
		Short: "Seed the database",
		RunE: func(cmd *cobra.Command, _ []string) error {
			ctx := cmd.Context()
			if err := c.ReadInConfig(); err != nil {
				return err
			}

			container := digo.NewContainer(ctx, digo.EnvProd, &c.cfg)
			db, err := digo.Get[*gorm.DB](container, services.ServiceKeyDB)
			if err != nil {
				return err
			}

			if flags.reset {
				if err := domain.DropAll(db); err != nil {
					return err
				}
				if err := domain.AutoMigrate(db); err != nil {
					return err
				}
			}

			moderator := domain.Agent{
				Name:                  "edan",
				AssistantId:           "asst_aggf9nmtEM77Qy3niFq64uBK",
				IconUrl:               "https://u6mo491ntx4iwuoz.public.blob.vercel-storage.com/emoji_2-qjcaZG8UxoP6TLl8wVoCHBgldAs89J.png",
				IncludeQuestionIntent: true,
				Role:                  "Moderator",
			}
			moderator.Save(db)
			suggester := domain.Agent{
				Name:        "vincent",
				AssistantId: "asst_YHXPoVMv8oD3kzBO2xO8jIxL",
				IconUrl:     "https://u6mo491ntx4iwuoz.public.blob.vercel-storage.com/emoji_3-FT5HiZTgMpE2Lspch6BsRi0OPO4IlP.png",
				Role:        "Suggester",
			}
			suggester.Save(db)
			scheduler := domain.Agent{
				Name:        "john",
				AssistantId: "asst_NesAuSvy09nlv7gI3c2Bcx61",
				IconUrl:     "https://u6mo491ntx4iwuoz.public.blob.vercel-storage.com/emoji_4-2Nak14Txvun5JvkF573HieU0849Z9M.png",
				Role:        "Scheduler",
			}
			scheduler.Save(db)

			mission := domain.Mission{
				Name: "컨퍼런스 일정 중에 갈만한 것을 예약해줘",
				Steps: []domain.Step{
					{
						SeqNo: 1,
						Actions: []domain.Action{
							{
								Subject: "니즈 파악(추천 키워드 선택지 제안)",
								Agent:   moderator,
							},
						},
					},
					{
						SeqNo: 2,
						Actions: []domain.Action{
							{
								Subject: "일정, 이벤트 추천",
								Agent:   suggester,
							},
						},
					},
					{
						SeqNo: 3,
						Actions: []domain.Action{
							{
								Subject: "적절한 일정 찾아 신청",
								Agent:   scheduler,
							},
						},
					},
				},
			}

			// TODO: Uncomment this block when the mission is ready
			//if err := db.Create(&mission).Error; err != nil {
			//	logger.Warn("failed to create mission", "err", err)
			//}

			sunny := domain.Agent{
				Name:        "sunny",
				AssistantId: "asst_Rho49KGmpl1IkiVWtfuNDd4i",
				IconUrl:     "https://u6mo491ntx4iwuoz.public.blob.vercel-storage.com/emoji_1-UDKR09vHK9lvc8X64QNBduP983CRH2.png",
				Role:        "Weather forecaster",
			}
			sunny.Save(db)
			eric := domain.Agent{
				Name:                  "eric",
				IconUrl:               "https://u6mo491ntx4iwuoz.public.blob.vercel-storage.com/ai_profile2_fin-fgp1RqJ0pSckjx6voV6ZLa8JhXiwVQ.png",
				IncludeQuestionIntent: true,
				AssistantId:           "asst_e08WipDCbvGTOVlFxiMjPa10",
				Role:                  "Community Organizer",
			}
			eric.Save(db)
			julia := domain.Agent{
				Name:                  "julia",
				IconUrl:               "https://u6mo491ntx4iwuoz.public.blob.vercel-storage.com/ai_profile1_fin-yJ5v3itdrTokAjXqUjTX6bT3DqVhgU.png",
				AssistantId:           "asst_7B77ZJoBXpia1QB0E5G8yOnG",
				IncludeQuestionIntent: true,
				Role:                  "Location Manager",
			}
			julia.Save(db)
			stella := domain.Agent{
				Name:        "stella",
				IconUrl:     "https://u6mo491ntx4iwuoz.public.blob.vercel-storage.com/ai_profile4_fin-IqdC8Bql3RRrF4mtHW6LdxVuCyygWH.png",
				AssistantId: "asst_Duu1WXwmYwPokx3n3JYIVvRo",
				Role:        "Ment Specialist",
			}
			stella.Save(db)
			amelia := domain.Agent{
				Name:                  "amelia",
				IconUrl:               "https://u6mo491ntx4iwuoz.public.blob.vercel-storage.com/ai_profile5_fin-Rya4OZX7HYfLd8Xrq4wVjHoKEn6nf3.png",
				AssistantId:           "asst_jLfJ39wLvYRKiy21Iirq6fIl",
				IncludeQuestionIntent: true,
				Role:                  "Event Scheduler",
			}
			amelia.Save(db)
			nolan := domain.Agent{
				Name:        "nolan",
				IconUrl:     "https://u6mo491ntx4iwuoz.public.blob.vercel-storage.com/ai_profile3_fin-prGwytGtS6ahk6iO9Xqy7ul272MAIv.png",
				AssistantId: "asst_OjOnv01dbmaGMa200m9bkDpm",
				Role:        "SNS Manager",
			}
			nolan.Save(db)

			mission = domain.Mission{
				Name:           "Organize a community meal gathering near Hong Kong CEC this weekend.",
				ResultTemplate: mission1ResultTemplate,
				Steps: []domain.Step{
					{
						SeqNo: 1,
						Actions: []domain.Action{
							{
								AgentID: sunny.ID,
								Subject: "Check the weather forecast for this weekend",
							},
							{
								AgentID: eric.ID,
								Subject: "Find a suitable location for the gathering",
							},
						},
					},
					{
						SeqNo: 2,
						Actions: []domain.Action{
							{
								AgentID: julia.ID,
								Subject: "Recommend a meeting place",
							},
						},
					},
					{
						SeqNo: 3,
						Actions: []domain.Action{
							{
								AgentID: amelia.ID,
								Subject: "Schedule the gathering",
							},
						},
					},
					{
						SeqNo: 4,
						Actions: []domain.Action{
							{
								AgentID: stella.ID,
								Subject: "Write a comment to invite people",
							},
							{
								AgentID: nolan.ID,
								Subject: "Post the event on X",
							},
						},
					},
				},
			}

			if err := db.Create(&mission).Error; err != nil {
				logger.Warn("failed to create mission", "err", err)
			}

			return nil
		},
	}

	f := cmd.Flags()
	f.BoolVar(&flags.reset, "reset", false, "Reset the database")

	return cmd
}
