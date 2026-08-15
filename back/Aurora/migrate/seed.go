package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/mohammedaouamri5/Aurora/constant"
	"github.com/mohammedaouamri5/Aurora/initializers"
	"github.com/mohammedaouamri5/Aurora/models"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

const demoPassword = "password123"

type seedUser struct {
	Name  string
	Email string
}

var seedUsers = []seedUser{
	{Name: "Alice Dev", Email: "alice@aurora.dev"},
	{Name: "Bob Builder", Email: "bob@aurora.dev"},
	{Name: "Carol Coder", Email: "carol@aurora.dev"},
}

type thread struct {
	Title string
	Steps []models.Message
}

func usr(content string) models.Message {
	return models.Message{Role: "user", Content: content}
}

func ast(content string) models.Message {
	return models.Message{Role: "assistant", Content: content}
}

var threads = []thread{
	{
		Title: "React useEffect hook",
		Steps: []models.Message{
			usr("How do I use useEffect in React? Show me a simple example."),
			ast("`useEffect` runs side effects after render.\n\n```jsx\nimport { useEffect, useState } from \"react\"\n\nexport function Timer() {\n  const [count, setCount] = useState(0)\n\n  useEffect(() => {\n    const id = setInterval(() => setCount((c) => c + 1), 1000)\n    return () => clearInterval(id)\n  }, [])\n\n  return <p>Seconds: {count}</p>\n}\n```\n\nKey points:\n- Empty `[]` runs once after mount.\n- The cleanup function runs on unmount."),
			usr("What does the cleanup function actually do?"),
			ast("It runs before the effect re-runs and when the component unmounts. For subscriptions, listeners, or timers, you return a function that tears them down so you avoid memory leaks.\n\n```jsx\nuseEffect(() => {\n  const onKey = (e) => console.log(e.key)\n  window.addEventListener(\"keydown\", onKey)\n  return () => window.removeEventListener(\"keydown\", onKey)\n}, [])\n```"),
		},
	},
	{
		Title: "Monads in Rust",
		Steps: []models.Message{
			usr("Explain monads using Rust's Option and Result. Give concrete code."),
			ast("A monad is a type with two operations: **map** (transform inside) and **flatMap**/**and_then** (chain). `Option<T>` and `Result<T, E>` are the classic examples.\n\n```rust\nfn parse_num(s: &str) -> Option<i32> {\n    s.parse().ok()\n}\n\nfn main() {\n    let a = parse_num(\"42\");\n    let b = a.and_then(|n| n.checked_add(1));\n    println!(\"{:?}\", b); // Some(43)\n}\n```\n\nWith `?` in a function returning `Result`:\n\n```rust\nfn div(x: f64, y: f64) -> Result<f64, String> {\n    if y == 0.0 { return Err(\"div by zero\".into()) }\n    Ok(x / y)\n}\n```"),
			usr("Is Option basically a List that holds at most one value?"),
			ast("Yes. `Option` is a `Vec` of length 0 or 1, and `Result` adds an error channel. That framing makes map/and_then intuitive — you're just mapping over a tiny container."),
		},
	},
	{
		Title: "Python decorators",
		Steps: []models.Message{
			usr("How do decorators work in Python? Show a timing decorator."),
			ast("A decorator is a function that takes a function and returns a wrapped one.\n\n```python\nimport time\n\ndef timer(fn):\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = fn(*args, **kwargs)\n        print(f\"{fn.__name__} took {time.perf_counter() - start:.4f}s\")\n        return result\n    return wrapper\n\n@timer\ndef work(n: int) -> int:\n    return sum(range(n))\n\nprint(work(1_000_000))\n```\n\n`@timer` is just `work = timer(work)`."),
		},
	},
	{
		Title: "Marrakech weekend plan",
		Steps: []models.Message{
			usr("Plan a 3-day weekend trip to Marrakech for two people, on a budget."),
			ast("## Day 1 — Old Medina\n- Visit **Jemaa el-Fnaa** at sunset.\n- Stay in a riad near the square (cheap, ~50€/night).\n- Eat street food: tanjia and msemen.\n\n## Day 2 — Palaces & Gardens\n- **Bahia Palace**, then **Majorelle Garden**.\n- Souks in the morning when quiet.\n\n## Day 3 — Day trip\n- Ait Ben Haddou or the **Ourika Valley**.\n\nBudget tip: negotiate taxis, use the bus for day trips, drink mint tea where locals go — it's 5 dirhams, not 50."),
			usr("Is the Majorelle Garden worth the entry fee?"),
			ast("Yes if you like gardens/photography. It's small but iconic — go right at opening to beat the crowds and the heat."),
		},
	},
	{
		Title: "Docker multi-stage builds",
		Steps: []models.Message{
			usr("Explain Docker multi-stage builds with a Go example."),
			ast("Multi-stage builds let you compile in a fat image, then copy only the artifact into a slim runtime image.\n\n```dockerfile\nFROM golang:1.22 AS build\nWORKDIR /src\nCOPY . .\nRUN CGO_ENABLED=0 go build -o /app/server ./cmd/server\n\nFROM alpine:3.20\nCOPY --from=build /app/server /usr/local/bin/server\nEXPOSE 8080\nCMD [\"server\"]\n```\n\nResult: no toolchain, no sources in the final image — just the binary."),
			usr("Why CGO_ENABLED=0?"),
			ast("It produces a static binary so it runs on alpine without glibc. Only disable it if you don't need cgo (sqlite, some net packages)."),
		},
	},
	{
		Title: "TypeScript generics",
		Steps: []models.Message{
			usr("Show me how generics work in TypeScript with a practical example."),
			ast("Generics let you write a function once and keep type safety.\n\n```ts\nfunction first<T>(items: T[]): T | undefined {\n  return items[0]\n}\n\nconst n = first([1, 2, 3])     // number | undefined\nconst s = first([\"a\", \"b\"]) // string | undefined\n\nfunction identity<T>(value: T): T {\n  return value\n}\n```\n\nFor components:\n\n```tsx\nfunction List<T>({ items }: { items: T[] }) {\n  return <ul>{items.map((i) => <li key={String(i)}>{String(i)}</li>)}</ul>\n}\n```"),
		},
	},
}

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("Could not load environment variables", err)
	}
	initializers.ConnectDB(&config)
}

func main() {
	reset := flag.Bool("reset", false, "delete previously seeded demo data first")
	flag.Parse()

	if *reset {
		resetSeeds()
	}

	ensureAssistant()

	for _, u := range seedUsers {
		user := ensureUser(u)
		seedChats(user)
	}

	fmt.Println("✅ Dummy data seeded")
	fmt.Printf("   Demo login → email: any of the seeded users, password: %s\n", demoPassword)
}

func ensureAssistant() {
	var existing models.Assistant
	err := initializers.Clients.Orm.Where("assistant_id = ?", constant.DefaultAssistantID).First(&existing).Error
	if err == nil {
		return
	}
	assistant := models.Assistant{
		AssistantID:   uuid.MustParse(constant.DefaultAssistantID),
		AssistantName: "Default",
		SystemPrompt:  constant.DefaultAssistant.SystemPrompt,
	}
	if err := initializers.Clients.Orm.Create(&assistant).Error; err != nil {
		log.Fatalf("Failed to create assistant: %v", err)
	}
	fmt.Println("   Assistant 'Default' created")
}

func ensureUser(u seedUser) models.User {
	var user models.User
	err := initializers.Clients.Orm.Where("email = ?", u.Email).First(&user).Error
	if err == nil {
		fmt.Printf("   User %s already exists, skipping\n", u.Email)
		return user
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(demoPassword), 14)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	user = models.User{Name: u.Name, Email: u.Email, Password: hash}
	if err := initializers.Clients.Orm.Create(&user).Error; err != nil {
		log.Fatalf("Failed to create user %s: %v", u.Email, err)
	}
	fmt.Printf("   User %s created\n", u.Email)
	return user
}

var perUserPlan = map[int][]struct {
	threadIdx int
	ago       time.Duration
}{
	0: {
		{threadIdx: 0, ago: 2 * time.Hour},
		{threadIdx: 1, ago: 6 * time.Hour},
		{threadIdx: 2, ago: 26 * time.Hour},
		{threadIdx: 3, ago: 3 * 24 * time.Hour},
		{threadIdx: 4, ago: 9 * 24 * time.Hour},
		{threadIdx: 5, ago: 21 * 24 * time.Hour},
	},
	1: {
		{threadIdx: 1, ago: 1 * time.Hour},
		{threadIdx: 3, ago: 30 * time.Hour},
		{threadIdx: 5, ago: 5 * 24 * time.Hour},
		{threadIdx: 0, ago: 14 * 24 * time.Hour},
	},
	2: {
		{threadIdx: 4, ago: 3 * time.Hour},
		{threadIdx: 2, ago: 28 * time.Hour},
		{threadIdx: 0, ago: 6 * 24 * time.Hour},
	},
}

func seedChats(user models.User) {
	userIndex := -1
	for i, u := range seedUsers {
		if u.Email == user.Email {
			userIndex = i
			break
		}
	}

	for _, entry := range perUserPlan[userIndex] {
		t := threads[entry.threadIdx]
		createdAt := time.Now().Add(-entry.ago)
		createConversation(user, t.Title, createdAt, t.Steps)
	}
	fmt.Printf("   %s: %d conversations seeded\n", user.Email, len(perUserPlan[userIndex]))
}

func createConversation(user models.User, title string, createdAt time.Time, steps []models.Message) {
	conv := models.Conversation{
		UserID:      user.UserID,
		AssistantID: uuid.MustParse(constant.DefaultAssistantID),
		Titel:       title,
		CreatedAt:   createdAt,
	}
	if err := initializers.Clients.Orm.Create(&conv).Error; err != nil {
		log.Fatalf("Failed to create conversation: %v", err)
	}

	messages := []models.Message{{Role: "system", Content: constant.DefaultAssistant.SystemPrompt}}
	for i, step := range steps {
		t := createdAt.Add(time.Duration(i+1) * 4 * time.Minute)
		step.CreatedAt = &t
		messages = append(messages, step)
	}

	chat := models.Chat{
		ConversationID: conv.ConversationID.String(),
		Messages:       messages,
	}
	collection := initializers.Clients.Mongo.Collection("conversations")
	if _, err := collection.InsertOne(context.Background(), chat); err != nil {
		log.Fatalf("Failed to seed messages for %s: %v", conv.ConversationID, err)
	}
}

func resetSeeds() {
	var emails []string
	for _, u := range seedUsers {
		emails = append(emails, u.Email)
	}

	var users []models.User
	initializers.Clients.Orm.Where("email IN ?", emails).Find(&users)

	var userIDs []uuid.UUID
	for _, u := range users {
		userIDs = append(userIDs, u.UserID)
	}
	if len(userIDs) == 0 {
		fmt.Println("   No seeded users found, nothing to reset")
		return
	}

	var convs []models.Conversation
	initializers.Clients.Orm.Where("user_id IN ?", userIDs).Find(&convs)

	var ids []string
	for _, c := range convs {
		ids = append(ids, c.ConversationID.String())
	}

	collection := initializers.Clients.Mongo.Collection("conversations")
	if len(ids) > 0 {
		if _, err := collection.DeleteMany(context.Background(), bson.M{"conversationID": bson.M{"$in": ids}}); err != nil {
			log.Fatalf("Failed to delete seeded messages: %v", err)
		}
	}

	initializers.Clients.Orm.Where("user_id IN ?", userIDs).Delete(&models.Conversation{})
	initializers.Clients.Orm.Where("email IN ?", emails).Delete(&models.User{})
	fmt.Printf("   Reset removed %d users and %d conversations\n", len(users), len(convs))
}
